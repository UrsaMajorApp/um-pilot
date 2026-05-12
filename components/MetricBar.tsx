import { Text, View } from 'react-native';
import { colors } from '../lib/theme';

export function MetricBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <Text style={{ color: colors.text, fontWeight: '700', flex: 1 }} selectable>
          {label}
        </Text>
        <Text style={{ color: colors.muted, fontVariant: ['tabular-nums'], fontWeight: '700' }} selectable>
          {value}%
        </Text>
      </View>
      <View style={{ height: 9, backgroundColor: '#E8ECF3', borderRadius: 999, overflow: 'hidden' }}>
        <View
          style={{
            width: `${Math.max(4, Math.min(100, value))}%`,
            height: '100%',
            backgroundColor: value > 70 ? colors.green : value > 42 ? colors.blue : colors.amber,
            borderRadius: 999,
          }}
        />
      </View>
    </View>
  );
}
