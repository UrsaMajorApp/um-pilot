import { Text, View } from 'react-native';
import type React from 'react';
import { colors, radius, shadows } from '../lib/theme';

export function SectionCard({
  children,
  eyebrow,
  title,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  title: string;
}) {
  return (
    <View
      style={{
        ...shadows.sm,
        backgroundColor: colors.paper,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: '#F0F1F6',
        padding: 18,
        gap: 14,
      }}
    >
      <View style={{ gap: 4 }}>
        {eyebrow ? (
          <Text style={{ color: colors.violet, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }} selectable>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }} selectable>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}
