import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';

export function DashboardHeader({
  eyebrow,
  metricLabel,
  metricValue,
  title,
}: {
  eyebrow: string;
  metricLabel?: string;
  metricValue?: number;
  title: string;
}) {
  return (
    <View style={{ backgroundColor: colors.primary, overflow: 'hidden' }}>
      <LinearGradient
        colors={colors.gradients.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 12 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 32, gap: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, fontWeight: '700' }} selectable>
                  {eyebrow}
                </Text>
                <Text style={{ color: colors.paper, fontSize: 32, fontWeight: '900', letterSpacing: 0 }} selectable>
                  {title}
                </Text>
              </View>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 24,
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.32)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="user" size={20} color={colors.paper} />
              </View>
            </View>

            {metricLabel && typeof metricValue === 'number' ? (
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.22)',
                  borderRadius: 24,
                  padding: 18,
                  gap: 10,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                  <Text style={{ color: colors.paper, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' }} selectable>
                    {metricLabel}
                  </Text>
                  <Text style={{ color: colors.paper, fontSize: 12, fontWeight: '900', fontVariant: ['tabular-nums'] }} selectable>
                    {metricValue}%
                  </Text>
                </View>
                <View style={{ height: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${Math.max(4, Math.min(100, metricValue))}%`,
                      borderRadius: 999,
                      backgroundColor: colors.paper,
                    }}
                  />
                </View>
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
