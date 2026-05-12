import { Feather } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { getPilotQuestions, type PilotQuestion } from '../data/diagnostic';
import { usePilot } from '../lib/pilot-store';
import { colors } from '../lib/theme';

export default function DiagnosticScreen() {
  const router = useRouter();
  const { ageGroup, answerQuestion, currentIndex, questionCount, report, tier, user } = usePilot();
  const [questionStartedAt, setQuestionStartedAt] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const questions = useMemo(() => (ageGroup && tier ? getPilotQuestions(ageGroup, tier) : []), [ageGroup, tier]);
  const question = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / Math.max(1, questions.length)) * 100);
  const { width } = useWindowDimensions();
  const isWide = width >= 860;
  const isCompact = width < 560;
  const isFinalAnalysis = isSaving && currentIndex >= questions.length - 1;

  const moduleLabel = useMemo(() => {
    if (question?.module === 'basic') return tier === 'basic' ? 'Basic тест' : 'Карточки';
    if (question?.module === 'mail') return 'Рабочая почта';
    if (question?.module === 'chat') return 'Мессенджер';
    return 'Таск-трекер';
  }, [question?.module]);

  if (!user) return <Redirect href="/" />;
  if (!tier) return <Redirect href={'/test-select' as never} />;
  if (report) return <Redirect href="/results" />;
  if (!question) return <Redirect href="/results" />;
  if (isFinalAnalysis) return <FinalAnalysisLoading isCompact={isCompact} questionCount={questionCount || questions.length} />;

  async function handleAnswer(optionId: 'v1' | 'v2' | 'v3') {
    if (isSaving) return;
    const option = question.options.find((item) => item.id === optionId);
    if (!option) return;
    setIsSaving(true);
    const isLast = await answerQuestion(option, Date.now() - questionStartedAt);
    setQuestionStartedAt(Date.now());
    setIsSaving(false);
    if (isLast) router.replace('/results');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceDark }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: isCompact ? 14 : 18, gap: isCompact ? 14 : 18, flexGrow: 1 }}
      >
        <View style={{ alignSelf: 'center', width: '100%', maxWidth: 1120, gap: 16 }}>
          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
              <Text style={{ color: colors.paper, fontSize: isCompact ? 27 : 22, fontWeight: '900', flexShrink: 1 }} selectable>
                {moduleLabel}
              </Text>
              <Text
                style={{ color: '#AAB1C3', fontSize: isCompact ? 16 : 14, fontWeight: '800', fontVariant: ['tabular-nums'] }}
                selectable
              >
                {currentIndex + 1}/{questions.length}
              </Text>
            </View>
            <View style={{ height: 9, borderRadius: 999, backgroundColor: '#2B3040', overflow: 'hidden' }}>
              <View style={{ width: `${progress}%`, height: '100%', backgroundColor: colors.violet }} />
            </View>
          </View>

          {question.module === 'basic' ? (
            <BasicQuestion question={question} isCompact={isCompact} isSaving={isSaving} onAnswer={handleAnswer} />
          ) : null}
          {question.module === 'mail' ? (
            <MailQuestion
              question={question}
              isCompact={isCompact}
              isSaving={isSaving}
              isWide={isWide}
              onAnswer={handleAnswer}
            />
          ) : null}
          {question.module === 'chat' ? (
            <ChatQuestion question={question} isCompact={isCompact} isSaving={isSaving} onAnswer={handleAnswer} />
          ) : null}
          {question.module === 'tasks' ? (
            <TaskQuestion
              question={question}
              isCompact={isCompact}
              isSaving={isSaving}
              isWide={isWide}
              onAnswer={handleAnswer}
            />
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function FinalAnalysisLoading({ isCompact, questionCount }: { isCompact: boolean; questionCount: number }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceDark }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          flexGrow: 1,
          padding: isCompact ? 18 : 28,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 560,
            backgroundColor: colors.paper,
            borderRadius: 8,
            padding: isCompact ? 24 : 34,
            gap: isCompact ? 18 : 22,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: '#F0EDFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator color={colors.violet} size="large" />
          </View>
          <View style={{ gap: 10, alignItems: 'center' }}>
            <Text
              style={{
                color: colors.text,
                fontSize: isCompact ? 28 : 34,
                lineHeight: isCompact ? 34 : 40,
                fontWeight: '900',
                textAlign: 'center',
              }}
              selectable
            >
              Анализируем ответы
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontSize: isCompact ? 16 : 18,
                lineHeight: isCompact ? 23 : 26,
                fontWeight: '700',
                textAlign: 'center',
              }}
              selectable
            >
              AI готовит персональный результат. Обычно это занимает несколько секунд.
            </Text>
          </View>
          <View style={{ width: '100%', gap: 8 }}>
            <View style={{ height: 10, borderRadius: 999, backgroundColor: '#E5E7F0', overflow: 'hidden' }}>
              <View style={{ width: '100%', height: '100%', backgroundColor: colors.violet }} />
            </View>
            <Text
              style={{ color: '#6B7280', fontSize: 13, fontWeight: '800', textAlign: 'center', fontVariant: ['tabular-nums'] }}
              selectable
            >
              {questionCount}/{questionCount}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function BasicQuestion({
  isCompact,
  isSaving,
  onAnswer,
  question,
}: {
  isCompact: boolean;
  isSaving: boolean;
  onAnswer: (option: 'v1' | 'v2' | 'v3') => void;
  question: PilotQuestion;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: '100%',
          maxWidth: 640,
          minHeight: isCompact ? 440 : 520,
          backgroundColor: '#191C25',
          borderRadius: 8,
          padding: isCompact ? 18 : 24,
          justifyContent: 'space-between',
          gap: 20,
          borderWidth: 1,
          borderColor: '#272C3B',
        }}
      >
        <View style={{ gap: 10 }}>
          <Text style={{ color: colors.violet, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' }} selectable>
            {question.subject}
          </Text>
          <Text
            style={{
              color: colors.paper,
              fontSize: isCompact ? 34 : 44,
              lineHeight: isCompact ? 40 : 50,
              fontWeight: '900',
            }}
            selectable
          >
            {question.prompt}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Pressable
            disabled={isSaving}
            onPress={() => onAnswer('v1')}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 64,
              borderRadius: 999,
              backgroundColor: pressed ? '#2B3040' : '#222737',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSaving ? 0.5 : 1,
            })}
          >
            <Feather name="x" size={26} color="#F87171" />
          </Pressable>
          <Pressable
            disabled={isSaving}
            onPress={() => onAnswer('v2')}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: 64,
              borderRadius: 999,
              backgroundColor: pressed ? '#4F46E5' : colors.violet,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSaving ? 0.5 : 1,
            })}
          >
            <Feather name="heart" size={26} color={colors.paper} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AnswerButton({
  disabled,
  label,
  onPress,
}: {
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#ECEEFF' : colors.paper,
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        borderColor: '#DDE3F0',
        opacity: disabled ? 0.5 : 1,
      })}
    >
      <Text style={{ color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 21 }} selectable>
        {label}
      </Text>
    </Pressable>
  );
}

function MailQuestion({
  isCompact,
  isSaving,
  isWide,
  onAnswer,
  question,
}: {
  isCompact: boolean;
  isSaving: boolean;
  isWide: boolean;
  onAnswer: (option: 'v1' | 'v2' | 'v3') => void;
  question: PilotQuestion;
}) {
  return (
    <View style={{ flexDirection: isWide ? 'row' : 'column', gap: 14 }}>
      {isWide ? (
        <View style={{ width: 280, backgroundColor: colors.cardDark, borderRadius: 8, padding: 12, gap: 8 }}>
          {['HR: NDA', 'IT: доступ', 'Финансы: отчет', 'Шеф: дедлайн'].map((item, index) => (
            <View
              key={item}
              style={{
                borderRadius: 8,
                backgroundColor: index === 0 ? '#242A3A' : 'transparent',
                padding: 12,
              }}
            >
              <Text style={{ color: index === 0 ? colors.paper : '#AAB1C3', fontWeight: '800' }} selectable>
                {item}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={{ flex: 1, backgroundColor: colors.cardDark, borderRadius: 8, padding: isCompact ? 14 : 18, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Feather name="mail" color={colors.violet} size={22} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.paper, fontSize: 18, fontWeight: '900' }} selectable>
              {question.subject}
            </Text>
            <Text style={{ color: '#AAB1C3', fontWeight: '700' }} selectable>
              От: {question.from}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: colors.paper,
            fontSize: isCompact ? 21 : 24,
            fontWeight: '800',
            lineHeight: isCompact ? 29 : 32,
          }}
          selectable
        >
          {question.prompt}
        </Text>
        <View style={{ gap: 10 }}>
          {question.options.map((option) => (
            <AnswerButton key={option.id} disabled={isSaving} label={option.text} onPress={() => onAnswer(option.id)} />
          ))}
        </View>
      </View>
    </View>
  );
}

function ChatQuestion({
  isCompact,
  isSaving,
  onAnswer,
  question,
}: {
  isCompact: boolean;
  isSaving: boolean;
  onAnswer: (option: 'v1' | 'v2' | 'v3') => void;
  question: PilotQuestion;
}) {
  return (
    <View style={{ backgroundColor: colors.cardDark, borderRadius: 8, padding: isCompact ? 14 : 16, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.violet,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.paper, fontWeight: '900' }} selectable>
            {question.from.slice(0, 1)}
          </Text>
        </View>
        <View>
          <Text style={{ color: colors.paper, fontSize: 18, fontWeight: '900' }} selectable>
            #{question.subject.toLowerCase().replaceAll(' ', '-')}
          </Text>
          <Text style={{ color: '#AAB1C3', fontWeight: '700' }} selectable>
            {question.from} печатает...
          </Text>
        </View>
      </View>
      <View style={{ alignSelf: 'flex-start', maxWidth: 760, backgroundColor: '#242A3A', borderRadius: 8, padding: 16 }}>
        <Text
          style={{
            color: colors.paper,
            fontSize: isCompact ? 19 : 21,
            lineHeight: isCompact ? 27 : 29,
            fontWeight: '800',
          }}
          selectable
        >
          {question.prompt}
        </Text>
      </View>
      <View style={{ gap: 10 }}>
        {question.options.map((option) => (
          <AnswerButton key={option.id} disabled={isSaving} label={option.text} onPress={() => onAnswer(option.id)} />
        ))}
      </View>
    </View>
  );
}

function TaskQuestion({
  isCompact,
  isSaving,
  isWide,
  onAnswer,
  question,
}: {
  isCompact: boolean;
  isSaving: boolean;
  isWide: boolean;
  onAnswer: (option: 'v1' | 'v2' | 'v3') => void;
  question: PilotQuestion;
}) {
  return (
    <View style={{ flexDirection: isWide ? 'row' : 'column', gap: isCompact ? 12 : 14 }}>
      {['Надо сделать', 'В процессе', 'Готово'].map((column, index) => (
        <View
          key={column}
          style={{
            flex: isWide ? 1 : undefined,
            backgroundColor: colors.cardDark,
            borderRadius: 8,
            padding: isCompact ? 12 : 14,
            gap: isCompact ? 10 : 12,
          }}
        >
          <Text style={{ color: '#AAB1C3', fontSize: isCompact ? 16 : 15, fontWeight: '900' }} selectable>
            {column}
          </Text>
          <View
            style={{
              backgroundColor: index === 1 ? colors.paper : '#242A3A',
              borderRadius: 8,
              padding: isCompact ? 14 : 16,
              gap: isCompact ? 12 : 14,
              minHeight: index === 1 ? undefined : isCompact ? 118 : 110,
            }}
          >
            {index === 1 ? (
              <>
                <Text style={{ color: colors.violet, fontSize: isCompact ? 18 : 15, fontWeight: '900' }} selectable>
                  {question.subject}
                </Text>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: isCompact ? 24 : 21,
                    lineHeight: isCompact ? 32 : 29,
                    fontWeight: '800',
                  }}
                  selectable
                >
                  {question.prompt}
                </Text>
                <View style={{ gap: 10 }}>
                  {question.options.map((option) => (
                    <AnswerButton
                      key={option.id}
                      disabled={isSaving}
                      label={option.text}
                      onPress={() => onAnswer(option.id)}
                    />
                  ))}
                </View>
              </>
            ) : (
              <Text style={{ color: '#AAB1C3', fontWeight: '700' }} selectable>
                {index === 0 ? 'Вводная задача' : 'Онбординг завершен'}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
