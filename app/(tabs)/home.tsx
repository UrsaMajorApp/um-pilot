import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DashboardHeader } from '../../components/DashboardHeader';
import { MarkdownText } from '../../components/MarkdownText';
import { MetricBar } from '../../components/MetricBar';
import { PlaceholderAction } from '../../components/PlaceholderAction';
import { SectionCard } from '../../components/SectionCard';
import { usePilot } from '../../lib/pilot-store';
import { colors, shadows } from '../../lib/theme';

export default function HomeTab() {
  const { report, startDiagnostic, tier, user } = usePilot();
  const [isStartingPro, setIsStartingPro] = useState(false);
  if (!report || !user) return null;

  const isBasicResult = tier === 'basic';
  const energy = Math.round(
    report.strengths.reduce((sum, item) => sum + item.value, 0) / Math.max(1, report.strengths.length)
  );

  async function handleStartPro() {
    if (isStartingPro) return;
    setIsStartingPro(true);
    await startDiagnostic('pro');
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <DashboardHeader
        eyebrow={`${report.personalityType} · профиль готов`}
        metricLabel="Энергия обучения"
        metricValue={energy}
        title={`Привет, ${user.fullName.split(' ')[0]}!`}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignSelf: 'center', width: '100%', maxWidth: 1080, padding: 20, paddingBottom: 108, gap: 22 }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <PlaceholderAction color="#EC4899" icon="maximize" label="Мой пропуск" />
          <PlaceholderAction color="#3B82F6" icon="calendar" label="Расписание" />
          <PlaceholderAction color="#10B981" icon="target" label="Задания" />
        </View>

        <View
          style={{
            ...shadows.sm,
            backgroundColor: '#EFF6FF',
            borderRadius: 32,
            borderWidth: 1,
            borderColor: '#DBEAFE',
            padding: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 18,
              backgroundColor: colors.paper,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#BFDBFE',
            }}
          >
            <Feather name="cpu" size={23} color="#3B82F6" />
          </View>
          <View style={{ flex: 1, minWidth: 220, gap: 6 }}>
            <Text style={{ color: '#1E3A8A', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' }} selectable>
              AI Ассистент UM
            </Text>
            <MarkdownText style={{ color: '#1D4ED8', fontSize: 14, lineHeight: 21, fontWeight: '600' }}>
              {report.aiNarrative?.profile ||
                `Я проанализировал твой тест. Сейчас самый сильный вектор: ${report.strengths[0]?.label.toLowerCase()}.`}
            </MarkdownText>
            <Text style={{ color: '#2563EB', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }} selectable>
              {isBasicResult ? 'Basic результат готов' : 'открыть про аналитику · скоро'}
            </Text>
          </View>
          {isBasicResult ? (
            <Pressable
              disabled={isStartingPro}
              onPress={handleStartPro}
              style={({ pressed }) => ({
                alignSelf: 'center',
                minHeight: 46,
                borderRadius: 16,
                backgroundColor: '#2563EB',
                opacity: isStartingPro ? 0.55 : pressed ? 0.86 : 1,
                paddingHorizontal: 18,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              })}
            >
              <Feather name="award" size={17} color={colors.paper} />
              <Text style={{ color: colors.paper, fontSize: 14, fontWeight: '900' }} selectable>
                {isStartingPro ? 'Открываем PRO...' : 'Пройти PRO тест'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexGrow: 1, flexBasis: 320 }}>
            <SectionCard eyebrow="Мои результаты" title={report.personalityType}>
              <Text style={{ color: colors.text, fontSize: 15, lineHeight: 23 }} selectable>
                {report.entProfile.label}: {report.entProfile.specialties.join(', ')}
              </Text>
              {report.strengths.map((item) => (
                <MetricBar key={item.key} label={item.label} value={item.value} />
              ))}
            </SectionCard>
          </View>

          <View style={{ flexGrow: 1, flexBasis: 320 }}>
            <SectionCard eyebrow="Рекомендации AI" title="Тебе может быть интересно">
              {report.recommendedClubs.map((club) => (
                <View
                  key={club}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    borderRadius: 24,
                    backgroundColor: '#F9FAFB',
                    borderWidth: 1,
                    borderColor: '#F0F1F6',
                  }}
                >
                  <View style={{ width: 42, height: 42, borderRadius: 16, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name="map-pin" size={17} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '900' }} selectable>
                      {club}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }} selectable>
                      Скоро появится в Алматы
                    </Text>
                  </View>
                </View>
              ))}
            </SectionCard>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
