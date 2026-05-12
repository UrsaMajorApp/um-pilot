import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { PrimaryButton } from '../components/PrimaryButton';
import { getAgeGroup, getPilotQuestions } from '../data/diagnostic';
import { usePilot } from '../lib/pilot-store';
import { colors, shadows } from '../lib/theme';

export default function TestSelectScreen() {
  const { ageGroup, report, startDiagnostic, tier, user } = usePilot();
  const [startingTier, setStartingTier] = useState<'basic' | 'pro' | null>(null);

  if (!user) return <Redirect href="/" />;
  if (report) return <Redirect href="/results" />;
  if (tier) return <Redirect href="/diagnostic" />;

  const selectedAgeGroup = ageGroup ?? getAgeGroup(user.age);
  const basicCount = getPilotQuestions(selectedAgeGroup, 'basic').length;
  const proCount = getPilotQuestions(selectedAgeGroup, 'pro').length;

  async function handleStart(nextTier: 'basic' | 'pro') {
    if (startingTier) return;
    setStartingTier(nextTier);
    await startDiagnostic(nextTier);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}
      >
        <View style={{ alignSelf: 'center', width: '100%', maxWidth: 980, gap: 18 }}>
          <View style={{ gap: 8 }}>
            <Text style={{ color: colors.violet, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' }} selectable>
              {selectedAgeGroup === '12-14' ? '12-14 лет' : '15-17 лет'} · пилот UM
            </Text>
            <Text style={{ color: colors.text, fontSize: 36, lineHeight: 42, fontWeight: '900' }} selectable>
              Выбери формат диагностики
            </Text>
            <Text style={{ color: colors.muted, fontSize: 16, lineHeight: 24, maxWidth: 680, fontWeight: '600' }} selectable>
              Basic быстрее показывает первый профиль. PRO открывает сюжетный тест с полным AI-отчетом и обзором платформы.
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <TestCard
              accent="#5C4DFF"
              disabled={Boolean(startingTier)}
              icon="zap"
              loading={startingTier === 'basic'}
              meta={selectedAgeGroup === '12-14' ? `${basicCount} карточек RIASEC` : `${basicCount} карточек карьерных якорей`}
              title="Пройти тест Basic"
              onPress={() => handleStart('basic')}
            />
            <TestCard
              accent="#12B981"
              disabled={Boolean(startingTier)}
              icon="award"
              loading={startingTier === 'pro'}
              meta={selectedAgeGroup === '12-14' ? `${proCount} вопросов · хакатон` : `${proCount} вопросов · первый день стажера`}
              title="Пройти тест PRO"
              onPress={() => handleStart('pro')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TestCard({
  accent,
  disabled,
  icon,
  loading,
  meta,
  onPress,
  title,
}: {
  accent: string;
  disabled: boolean;
  icon: keyof typeof Feather.glyphMap;
  loading: boolean;
  meta: string;
  onPress: () => void;
  title: string;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        ...shadows.sm,
        flexGrow: 1,
        flexBasis: 320,
        backgroundColor: colors.paper,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: pressed ? accent : '#ECEEF5',
        padding: 20,
        gap: 18,
        opacity: disabled && !loading ? 0.55 : 1,
      })}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 20,
          backgroundColor: `${accent}18`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={25} color={accent} />
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ color: colors.text, fontSize: 24, lineHeight: 30, fontWeight: '900' }} selectable>
          {title}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 22, fontWeight: '700' }} selectable>
          {meta}
        </Text>
      </View>
      <PrimaryButton
        disabled={disabled}
        icon={loading ? 'loader' : 'arrow-right'}
        label={loading ? 'Открываем...' : 'Начать'}
        onPress={onPress}
      />
    </Pressable>
  );
}
