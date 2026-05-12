import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { colors, shadows } from '../lib/theme';

export function PlaceholderAction({
  color,
  icon,
  label,
}: {
  color: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
}) {
  return (
    <Pressable
      disabled
      style={{
        ...shadows.sm,
        flex: 1,
        minWidth: 132,
        backgroundColor: colors.paper,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#F2F3F8',
        padding: 16,
        alignItems: 'center',
        gap: 10,
        opacity: 0.78,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 18,
          backgroundColor: `${color}18`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text style={{ color: colors.text, fontSize: 11, fontWeight: '900', textAlign: 'center', textTransform: 'uppercase' }} selectable>
        {label}
      </Text>
      <Text style={{ color: colors.muted, fontSize: 10, fontWeight: '800' }} selectable>
        скоро
      </Text>
    </Pressable>
  );
}
