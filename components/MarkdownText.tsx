import { Text, type StyleProp, type TextStyle } from 'react-native';

export function MarkdownText({
  children,
  selectable = true,
  style,
}: {
  children: string;
  selectable?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const parts = children.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <Text selectable={selectable} style={style}>
      {parts.map((part, index) => {
        const isBold = part.startsWith('**') && part.endsWith('**');
        const text = isBold ? part.slice(2, -2) : part;

        return (
          <Text key={`${text}-${index}`} style={isBold ? { fontWeight: '900' } : undefined}>
            {text}
          </Text>
        );
      })}
    </Text>
  );
}
