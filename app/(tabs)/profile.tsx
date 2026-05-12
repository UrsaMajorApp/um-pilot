import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DashboardHeader } from '../../components/DashboardHeader';
import { MarkdownText } from '../../components/MarkdownText';
import { MetricBar } from '../../components/MetricBar';
import { SectionCard } from '../../components/SectionCard';
import { TalentRadar } from '../../components/TalentRadar';
import { usePilot } from '../../lib/pilot-store';
import { colors, shadows } from '../../lib/theme';

export default function ProfileTab() {
  const { report, user } = usePilot();
  if (!report || !user) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <DashboardHeader eyebrow={`${user.age} лет · ${user.grade} класс`} title={user.fullName} />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignSelf: 'center', width: '100%', maxWidth: 1080, padding: 20, paddingBottom: 108, gap: 16 }}
      >
        <View style={{ ...shadows.sm, backgroundColor: colors.paper, borderRadius: 32, borderWidth: 1, borderColor: '#F0F1F6', padding: 18, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 64, height: 64, borderRadius: 28, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '900' }} selectable>
                {user.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900' }} selectable>
                {report.personalityType}
              </Text>
              <Text style={{ color: colors.muted, fontWeight: '700' }} selectable>
                {report.entProfile.label} · профиль готов
              </Text>
            </View>
            <Pressable disabled style={{ width: 44, height: 44, borderRadius: 18, backgroundColor: '#F7F7FB', alignItems: 'center', justifyContent: 'center', opacity: 0.72 }}>
              <Feather name="settings" size={18} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexGrow: 1, flexBasis: 360 }}>
            <SectionCard eyebrow="Паутинка" title="Таланты">
              <TalentRadar data={report.talentWeb} />
            </SectionCard>
          </View>
          <View style={{ flexGrow: 1, flexBasis: 360 }}>
            <SectionCard eyebrow="Диагностика" title="Полный результат">
              {report.talentWeb.map((item) => (
                <MetricBar key={item.key} label={item.label} value={item.value} />
              ))}
            </SectionCard>
          </View>
        </View>

        <SectionCard eyebrow="Карьерные мотиваторы" title={report.topAnchors.map((anchor) => anchor.label).join(', ')}>
          <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24 }} selectable>
            Подходящие направления: {report.entProfile.specialties.join(', ')}. Предметный фокус: {report.entProfile.subjects.join(', ')}.
          </Text>
        </SectionCard>

        <SectionCard eyebrow="Для родителей" title="Как поддержать">
          <MarkdownText style={{ color: colors.text, fontSize: 16, lineHeight: 24 }}>
            {report.aiNarrative?.parentAdvice || report.parentTip}
          </MarkdownText>
          <Pressable disabled style={{ backgroundColor: '#F3F4F6', borderRadius: 18, paddingVertical: 13, alignItems: 'center', opacity: 0.8 }}>
            <Text style={{ color: colors.muted, fontWeight: '900' }} selectable>
              Скачать отчет · скоро
            </Text>
          </Pressable>
        </SectionCard>
      </ScrollView>
    </View>
  );
}
