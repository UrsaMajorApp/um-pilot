import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DashboardHeader } from '../../components/DashboardHeader';
import { usePilot } from '../../lib/pilot-store';
import { colors, shadows } from '../../lib/theme';

export default function CoursesTab() {
  const { ageGroup, report, user } = usePilot();
  const courses = report?.recommendedClubs ?? [];
  const ageTag = ageGroup ? `${ageGroup} лет` : user ? `${user.age} лет` : 'пилот';

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <DashboardHeader eyebrow="Каталог организаций" title="Кружки Алматы" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignSelf: 'center', width: '100%', maxWidth: 980, padding: 20, paddingBottom: 108, gap: 16 }}
      >
        <Text style={{ color: colors.muted, fontSize: 15, lineHeight: 23, fontWeight: '600' }} selectable>
          Это демонстрационный каталог в стиле основного приложения. Реальные партнеры, расписание и запись будут доступны после запуска.
        </Text>

        {courses.map((course, index) => (
          <View
            key={course}
            style={{
              ...shadows.sm,
              backgroundColor: colors.paper,
              borderRadius: 32,
              borderWidth: 1,
              borderColor: '#F0F1F6',
              padding: 18,
              gap: 14,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14 }}>
              <View style={{ flexDirection: 'row', flex: 1, gap: 14 }}>
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 22,
                    backgroundColor: index % 2 === 0 ? '#EEF2FF' : '#EFF6FF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name={index % 2 === 0 ? 'code' : 'edit-3'} size={24} color={index % 2 === 0 ? colors.primary : '#3B82F6'} />
                </View>
                <View style={{ flex: 1, gap: 6 }}>
                  <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }} selectable>
                    {course}
                  </Text>
                  <Text style={{ color: colors.muted, lineHeight: 21, fontWeight: '600' }} selectable>
                    {index % 2 === 0 ? 'Проектные занятия 2 раза в неделю' : 'Практика, мини-команды и итоговый проект'}
                  </Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#FFF7ED', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7, height: 32 }}>
                <Text style={{ color: '#9A5B00', fontSize: 12, fontWeight: '900' }} selectable>
                  скоро
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {['Алматы', ageTag, 'по рекомендации AI'].map((tag) => (
                <View key={tag} style={{ backgroundColor: '#F7F7FB', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 }}>
                  <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '800' }} selectable>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            <Pressable disabled style={{ backgroundColor: '#F3F4F6', borderRadius: 18, paddingVertical: 13, alignItems: 'center', opacity: 0.8 }}>
              <Text style={{ color: colors.muted, fontWeight: '900' }} selectable>
                Записаться · скоро
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
