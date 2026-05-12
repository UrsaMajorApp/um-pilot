import { Feather } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { MetricBar } from '../components/MetricBar';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionCard } from '../components/SectionCard';
import { TalentRadar } from '../components/TalentRadar';
import { usePilot } from '../lib/pilot-store';
import { colors } from '../lib/theme';

export default function ResultsScreen() {
  const router = useRouter();
  const { report, resetPilot, startDiagnostic, tier, user } = usePilot();
  const [isStartingPro, setIsStartingPro] = useState(false);

  if (!user) return <Redirect href="/" />;
  if (!report) return <Redirect href="/diagnostic" />;
  const aiHeader = report.aiNarrative?.header;
  const aiRecommendations = report.aiNarrative?.recommendations;
  const isBasicResult = tier === 'basic';

  async function handleStartPro() {
    if (isStartingPro) return;
    setIsStartingPro(true);
    await startDiagnostic('pro');
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ alignSelf: 'center', width: '100%', maxWidth: 1120, padding: 18, gap: 16 }}>
        <View
          style={{
            backgroundColor: colors.ink,
            borderRadius: 8,
            padding: 22,
            gap: 16,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14, alignItems: 'center' }}>
            <View style={{ gap: 8, flex: 1 }}>
              <Text style={{ color: '#AAB1C3', fontWeight: '800' }} selectable>
                {aiHeader?.eyebrow || 'Диагностика завершена'}
              </Text>
              <Text style={{ color: colors.paper, fontSize: 32, fontWeight: '900', letterSpacing: 0 }} selectable>
                {aiHeader?.title || `${user.fullName}, твой профиль: ${report.personalityType}`}
              </Text>
            </View>
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                backgroundColor: colors.violet,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="award" size={25} color={colors.paper} />
            </View>
          </View>
          <Text style={{ color: '#D7DCE8', fontSize: 17, lineHeight: 25 }} selectable>
            {aiHeader?.summary ||
              `Ты сильнее всего проявляешься через ${report.strengths
                .map((item) => item.label.toLowerCase())
                .join(', ')}. Подходящий учебный профиль: ${report.entProfile.label}.`}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexGrow: 1, flexBasis: 330 }}>
            <SectionCard eyebrow="Паутинка талантов" title="Визуальный профиль">
              <TalentRadar data={report.talentWeb} />
            </SectionCard>
          </View>
          <View style={{ flexGrow: 1, flexBasis: 330 }}>
            <SectionCard eyebrow="Сильные стороны" title="Топ-навыки">
              {report.strengths.map((item) => (
                <MetricBar key={item.key} label={item.label} value={item.value} />
              ))}
            </SectionCard>
          </View>
        </View>

        <SectionCard eyebrow="Рекомендации" title="Куда смотреть дальше">
          <View style={{ gap: 12 }}>
            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
              {aiRecommendations?.subjects ||
                `Предметы: ${report.entProfile.subjects.join(', ')}. Возможные направления: ${report.entProfile.specialties.join(', ')}.`}
            </Text>
            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
              {aiRecommendations?.directions || `Возможные направления: ${report.entProfile.specialties.join(', ')}.`}
            </Text>
            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
              {aiRecommendations?.motivators || `Карьерные мотиваторы: ${report.topAnchors.map((anchor) => anchor.label).join(', ')}.`}
            </Text>
            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
              {aiRecommendations?.decisionStyle || `Стиль решений: ${report.cognitiveStyle}.`}
            </Text>
            {aiRecommendations?.nextStep ? (
              <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
                {aiRecommendations.nextStep}
              </Text>
            ) : null}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {report.recommendedClubs.map((club) => (
                <View key={club} style={{ backgroundColor: '#EEF2FF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
                  <Text style={{ color: colors.text, fontWeight: '800' }} selectable>
                    {club}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </SectionCard>

        {report.aiNarrative ? (
          <SectionCard eyebrow={report.aiGenerated ? 'AI анализ' : 'Анализ'} title="Персональный вывод">
            <View style={{ gap: 12 }}>
              <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
                {report.aiNarrative.profile}
              </Text>
              <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
                {report.aiNarrative.strengths}
              </Text>
              <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
                {report.aiNarrative.growth}
              </Text>
              <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
                {report.aiNarrative.careers}
              </Text>
            </View>
          </SectionCard>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <View style={{ flexGrow: 1, flexBasis: 260 }}>
            <PrimaryButton
              icon={isBasicResult ? 'award' : 'grid'}
              label={isBasicResult ? (isStartingPro ? 'Открываем PRO...' : 'Пройти тест PRO') : 'Обзор UM'}
              onPress={isBasicResult ? handleStartPro : () => router.replace('/(tabs)/home')}
            />
          </View>
          <View style={{ flexGrow: 1, flexBasis: 220 }}>
            <PrimaryButton
              icon={isBasicResult ? 'grid' : 'refresh-ccw'}
              label={isBasicResult ? 'Обзор UM' : 'Начать заново'}
              onPress={isBasicResult ? () => router.replace('/(tabs)/home') : resetPilot}
              tone="light"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
