import { pilotQuestions } from '../data/diagnostic';
import { pilotSupabase } from './pilot-supabase';
import type { PilotAnswer, PilotUser } from './pilot-store';
import type { Behavioral, PilotReport } from './results';
import type { AgeGroup, AnchorScores, Scores, TestTier } from '../data/diagnostic';

type AnalyzeDiagnosticResponse = {
  report?: PilotReport['aiNarrative'];
};

const AI_ANALYSIS_TIMEOUT_MS = 30000;

export async function generatePilotAiNarrative(input: {
  answers: PilotAnswer[];
  anchors: AnchorScores;
  ageGroup: AgeGroup | null;
  behavioral: Behavioral;
  baseReport: PilotReport;
  scores: Scores;
  tier: TestTier | null;
  user: PilotUser;
}) {
  if (!pilotSupabase) return null;

  const answerDetails = input.answers.map((answer) => {
    const question = pilotQuestions.find((item) => item.id === answer.questionId);
    const option = question?.options.find((item) => item.id === answer.variantId);
    return {
      question_id: answer.questionId,
      question: question?.prompt ?? answer.questionId,
      answer: option?.text ?? answer.variantId,
      response_time_ms: answer.responseTimeMs,
    };
  });

  const invokePromise = pilotSupabase.functions.invoke<AnalyzeDiagnosticResponse>('analyze-diagnostic', {
    body: {
      user: input.user,
      scores: input.scores,
      anchors: input.anchors,
      age_group: input.ageGroup,
      behavioral: input.behavioral,
      base_report: input.baseReport,
      tier: input.tier,
      answers: answerDetails,
    },
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('AI analysis timeout')), AI_ANALYSIS_TIMEOUT_MS);
  });

  const { data, error } = await Promise.race([invokePromise, timeoutPromise]);
  if (error) throw error;
  return data?.report ?? null;
}
