import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  emptyAnchors,
  emptyScores,
  getAgeGroup,
  getPilotQuestions,
  type AgeGroup,
  type AnchorScores,
  type PilotOption,
  type Scores,
  type TestTier,
} from '../data/diagnostic';
import { isPilotSupabaseConfigured, pilotSupabase } from './pilot-supabase';
import { generatePilotAiNarrative } from './pilot-ai';
import { applyAiQuantitativeReport, buildPilotReport, type Behavioral, type PilotReport } from './results';

const STORAGE_KEY = 'um-pilot-session-v1';

export type PilotUser = {
  id: string;
  fullName: string;
  phone: string;
  age: number;
  grade: number;
};

export type PilotAnswer = {
  questionId: string;
  variantId: string;
  responseTimeMs: number;
};

type PilotState = {
  user: PilotUser | null;
  ageGroup: AgeGroup | null;
  tier: TestTier | null;
  currentIndex: number;
  scores: Scores;
  anchors: AnchorScores;
  answers: PilotAnswer[];
  behavioral: Behavioral;
  report: PilotReport | null;
  isHydrated: boolean;
  isRemoteEnabled: boolean;
};

type StartInput = Omit<PilotUser, 'id'>;

type PilotContextValue = PilotState & {
  questionCount: number;
  startPilot: (input: StartInput) => Promise<void>;
  startDiagnostic: (tier: TestTier) => Promise<void>;
  answerQuestion: (option: PilotOption, responseTimeMs: number) => Promise<boolean>;
  completeDiagnostic: () => Promise<void>;
  resetPilot: () => Promise<void>;
};

const initialState: PilotState = {
  user: null,
  ageGroup: null,
  tier: null,
  currentIndex: 0,
  scores: emptyScores(),
  anchors: emptyAnchors(),
  answers: [],
  behavioral: {
    avg_response_time_ms: 0,
    fast_answers_count: 0,
    answer_changes_count: 0,
  },
  report: null,
  isHydrated: false,
  isRemoteEnabled: isPilotSupabaseConfigured,
};

const PilotContext = createContext<PilotContextValue | null>(null);

function createLocalId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

async function persistState(state: PilotState) {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      ageGroup: state.ageGroup,
      tier: state.tier,
      currentIndex: state.currentIndex,
      scores: state.scores,
      anchors: state.anchors,
      answers: state.answers,
      behavioral: state.behavioral,
      report: state.report,
      isRemoteEnabled: state.isRemoteEnabled,
    })
  );
}

function addDeltas<T extends Record<string, number>>(base: T, deltas: Partial<Record<keyof T, number>> = {}) {
  const next = { ...base };
  for (const [key, value] of Object.entries(deltas)) {
    if (typeof value !== 'number') continue;
    next[key as keyof T] = ((next[key as keyof T] as number) + value) as T[keyof T];
  }
  return next;
}

async function getVerifiedRemoteUserId(expectedUserId?: string) {
  if (!pilotSupabase) return null;
  const { data } = await pilotSupabase.auth.getSession();
  const sessionUserId = data.session?.user.id ?? null;
  if (!sessionUserId) return null;
  if (expectedUserId && sessionUserId !== expectedUserId) return null;
  return sessionUserId;
}

export function PilotProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PilotState>(initialState);
  const router = useRouter();
  const activeQuestions = state.ageGroup && state.tier ? getPilotQuestions(state.ageGroup, state.tier) : [];

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!mounted) return;
      if (!raw) {
        setState((current) => ({ ...current, isHydrated: true }));
        return;
      }

      try {
        const parsed = JSON.parse(raw) as Partial<PilotState>;
        const remoteUserId = parsed.user?.id
          ? await getVerifiedRemoteUserId(parsed.user.id)
          : null;

        setState({
          ...initialState,
          ...parsed,
          isHydrated: true,
          isRemoteEnabled: Boolean(remoteUserId),
          scores: { ...emptyScores(), ...parsed.scores },
          anchors: { ...emptyAnchors(), ...parsed.anchors },
          answers: parsed.answers ?? [],
        });
      } catch {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setState((current) => ({ ...current, isHydrated: true }));
      }
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);

  const startPilot = useCallback(
    async (input: StartInput) => {
      let id = createLocalId();
      let remoteEnabled = false;

      if (pilotSupabase) {
        const { data, error } = await pilotSupabase.auth.signInAnonymously();
        const remoteUserId = !error ? await getVerifiedRemoteUserId(data.user?.id) : null;

        if (remoteUserId) {
          id = remoteUserId;
          const { error: profileError } = await pilotSupabase.from('pilot_users').insert({
            id,
            full_name: input.fullName,
            phone: input.phone,
            age: input.age,
            grade: input.grade,
          });

          if (!profileError || profileError.code === '23505') {
            remoteEnabled = true;
          } else {
            console.warn('Pilot profile was not saved remotely:', profileError);
          }
        } else if (error) {
          console.warn('Anonymous Supabase sign-in failed; using local pilot mode:', error);
        }
      }

      const nextState: PilotState = {
        ...initialState,
        user: { id, ...input },
        ageGroup: getAgeGroup(input.age),
        isHydrated: true,
        isRemoteEnabled: remoteEnabled,
      };

      setState(nextState);
      await persistState(nextState);
      router.replace('/test-select' as never);
    },
    [router]
  );

  const startDiagnostic = useCallback(
    async (tier: TestTier) => {
      if (!state.user || !state.ageGroup) return;

      const nextState: PilotState = {
        ...state,
        tier,
        currentIndex: 0,
        scores: emptyScores(),
        anchors: emptyAnchors(),
        answers: [],
        behavioral: {
          avg_response_time_ms: 0,
          fast_answers_count: 0,
          answer_changes_count: 0,
        },
        report: null,
      };

      setState(nextState);
      await persistState(nextState);
      router.replace('/diagnostic');
    },
    [router, state]
  );

  const answerQuestion = useCallback(
    async (option: PilotOption, responseTimeMs: number) => {
      const questions = state.ageGroup && state.tier ? getPilotQuestions(state.ageGroup, state.tier) : [];
      const question = questions[state.currentIndex];
      if (!state.user || !question) return false;

      const nextScores = addDeltas(state.scores, option.deltas);
      const nextAnchors = addDeltas(state.anchors, option.anchors);
      const nextAnswers = [
        ...state.answers,
        {
          questionId: question.id,
          variantId: option.id,
          responseTimeMs,
        },
      ];
      const nextBehavioral: Behavioral = {
        avg_response_time_ms: Math.round(
          nextAnswers.reduce((sum, answer) => sum + answer.responseTimeMs, 0) / nextAnswers.length
        ),
        fast_answers_count: state.behavioral.fast_answers_count + (responseTimeMs < 3000 ? 1 : 0),
        answer_changes_count: state.behavioral.answer_changes_count,
      };
      const isLastQuestion = state.currentIndex >= questions.length - 1;
      const baseReport = isLastQuestion ? buildPilotReport(nextScores, nextAnchors, nextBehavioral) : null;
      const nextState: PilotState = {
        ...state,
        scores: nextScores,
        anchors: nextAnchors,
        answers: nextAnswers,
        behavioral: nextBehavioral,
        currentIndex: isLastQuestion ? state.currentIndex : state.currentIndex + 1,
        report: isLastQuestion ? null : state.report,
      };

      setState(nextState);
      await persistState(nextState);

      let finalReport = baseReport;

      if (isLastQuestion && baseReport && state.user) {
        try {
          const aiNarrative = await generatePilotAiNarrative({
            answers: nextAnswers,
            anchors: nextAnchors,
            ageGroup: state.ageGroup,
            baseReport,
            behavioral: nextBehavioral,
            scores: nextScores,
            tier: state.tier,
            user: state.user,
          });

          if (aiNarrative) {
            finalReport = {
              ...applyAiQuantitativeReport(baseReport, aiNarrative),
              aiGenerated: true,
              aiNarrative,
              parentTip: aiNarrative.parentAdvice || baseReport.parentTip,
            };
          }
        } catch (error) {
          console.warn('Pilot AI narrative unavailable:', error);
        }

        const finalState = { ...nextState, report: finalReport };
        setState(finalState);
        await persistState(finalState);
      }

      const remoteUserId = state.isRemoteEnabled ? await getVerifiedRemoteUserId(state.user.id) : null;

      if (pilotSupabase && remoteUserId) {
        const { error: answerError } = await pilotSupabase.from('pilot_answers').insert({
          user_id: state.user.id,
          question_id: question.id,
          variant_chosen: option.id,
          response_time_ms: responseTimeMs,
        });

        if (answerError) {
          console.warn('Pilot answer was not saved remotely:', answerError);
        }

        if (isLastQuestion) {
          const { error: sessionError } = await pilotSupabase.from('diagnostic_sessions').insert({
            user_id: state.user.id,
            age_group: state.ageGroup ?? '15-17',
            tariff: state.tier ?? 'pro',
            scores: nextScores,
            behavioral: nextBehavioral,
            shein_anchors: nextAnchors,
            report: finalReport,
          });

          if (sessionError) {
            console.warn('Pilot diagnostic session was not saved remotely:', sessionError);
          }
        }
      } else if (pilotSupabase && state.isRemoteEnabled) {
        console.warn('Skipping remote pilot write: Supabase session does not match pilot user.');
      }

      return isLastQuestion;
    },
    [state]
  );

  const completeDiagnostic = useCallback(async () => {
    if (!state.user) return;
    const baseReport = buildPilotReport(state.scores, state.anchors, state.behavioral);
    let finalReport = baseReport;

    try {
      const aiNarrative = await generatePilotAiNarrative({
        answers: state.answers,
        anchors: state.anchors,
        ageGroup: state.ageGroup,
        baseReport,
        behavioral: state.behavioral,
        scores: state.scores,
        tier: state.tier,
        user: state.user,
      });

      if (aiNarrative) {
        finalReport = {
          ...applyAiQuantitativeReport(baseReport, aiNarrative),
          aiGenerated: true,
          aiNarrative,
          parentTip: aiNarrative.parentAdvice || baseReport.parentTip,
        };
      }
    } catch (error) {
      console.warn('Pilot AI narrative unavailable:', error);
    }

    const nextState = { ...state, report: finalReport };
    setState(nextState);
    await persistState(nextState);

    const remoteUserId = state.isRemoteEnabled ? await getVerifiedRemoteUserId(state.user.id) : null;

    if (pilotSupabase && remoteUserId) {
      const { error: sessionError } = await pilotSupabase.from('diagnostic_sessions').insert({
        user_id: state.user.id,
        age_group: state.ageGroup ?? '15-17',
        tariff: state.tier ?? 'pro',
        scores: state.scores,
        behavioral: state.behavioral,
        shein_anchors: state.anchors,
        report: finalReport,
      });

      if (sessionError) {
        console.warn('Pilot diagnostic session was not saved remotely:', sessionError);
      }
    }
  }, [state]);

  const resetPilot = useCallback(async () => {
    setState({ ...initialState, isHydrated: true });
    await AsyncStorage.removeItem(STORAGE_KEY);
    if (pilotSupabase) {
      await pilotSupabase.auth.signOut({ scope: 'local' }).catch(() => {});
    }
    router.replace('/');
  }, [router]);

  const value = useMemo(
    () => ({
      ...state,
      questionCount: activeQuestions.length,
      startPilot,
      startDiagnostic,
      answerQuestion,
      completeDiagnostic,
      resetPilot,
    }),
    [activeQuestions.length, answerQuestion, completeDiagnostic, resetPilot, startDiagnostic, startPilot, state]
  );

  return <PilotContext.Provider value={value}>{children}</PilotContext.Provider>;
}

export function usePilot() {
  const context = React.use(PilotContext);
  if (!context) throw new Error('usePilot must be used inside PilotProvider');
  return context;
}
