import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { colors, radius, shadows } from '../lib/theme';

export function PrimaryButton({
  disabled,
  icon,
  label,
  onPress,
  tone = 'primary',
}: {
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'dark' | 'light';
}) {
  const backgroundColor = tone === 'dark' ? colors.ink : tone === 'light' ? colors.paper : colors.violet;
  const foreground = tone === 'light' ? colors.text : colors.paper;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        ...shadows.md,
        minHeight: 54,
        borderRadius: radius.lg,
        backgroundColor,
        opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 18,
        borderWidth: tone === 'light' ? 1 : 0,
        borderColor: colors.line,
        overflow: 'hidden',
      })}
    >
      {tone === 'primary' ? (
        <LinearGradient colors={colors.gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', inset: 0 }} />
      ) : null}
      {icon ? <Feather name={icon} size={19} color={foreground} /> : null}
      <Text style={{ color: foreground, fontSize: 16, fontWeight: '800' }} selectable>
        {label}
      </Text>
    </Pressable>
  );
}

export function IconPill({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.24)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Feather name={icon} size={14} color={colors.paper} />
      <Text style={{ color: colors.paper, fontSize: 13, fontWeight: '700' }} selectable>
        {label}
      </Text>
    </View>
  );
}
