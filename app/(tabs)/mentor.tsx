import { Feather } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { DashboardHeader } from '../../components/DashboardHeader';
import { colors, shadows } from '../../lib/theme';

export default function MentorTab() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <DashboardHeader eyebrow="Связь с наставником" title="Ментор" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignSelf: 'center', width: '100%', maxWidth: 920, padding: 20, paddingBottom: 108, gap: 16 }}
      >
        <View style={{ ...shadows.sm, backgroundColor: '#F5F3FF', borderRadius: 32, borderWidth: 1, borderColor: '#E9D5FF', padding: 20, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 22,
                backgroundColor: colors.paper,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#DDD6FE',
              }}
            >
              <Feather name="message-circle" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#3B0764', fontSize: 18, fontWeight: '900' }} selectable>
                Чат с наставником
              </Text>
              <Text style={{ color: '#7E22CE', fontWeight: '700' }} selectable>
                Скоро будет доступно
              </Text>
            </View>
          </View>

          <View style={{ alignSelf: 'flex-start', maxWidth: 640, backgroundColor: colors.paper, borderRadius: 24, padding: 14 }}>
            <Text style={{ color: colors.text, fontSize: 16, lineHeight: 23, fontWeight: '600' }} selectable>
              Привет! В полной версии здесь можно будет обсудить результаты диагностики, выбрать кружки и собрать личный план развития.
            </Text>
          </View>
          <View style={{ alignSelf: 'flex-end', maxWidth: 640, backgroundColor: colors.primary, borderRadius: 24, padding: 14 }}>
            <Text style={{ color: colors.paper, fontSize: 16, lineHeight: 23, fontWeight: '700' }} selectable>
              Хочу понять, какие профессии мне подходят.
            </Text>
          </View>

          <Pressable disabled style={{ backgroundColor: colors.paper, borderRadius: 18, paddingVertical: 13, alignItems: 'center', opacity: 0.82 }}>
            <Text style={{ color: colors.primary, fontWeight: '900' }} selectable>
              Написать ментору · скоро
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
