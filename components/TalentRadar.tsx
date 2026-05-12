import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import { View } from 'react-native';
import type { PilotReport } from '../lib/results';

export function TalentRadar({ data, size = 280 }: { data: PilotReport['talentWeb']; size?: number }) {
  const center = size / 2;
  const radius = size * 0.32;
  const labelRadius = size * 0.43;
  const points = data.map((item, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / data.length;
    const valueRadius = radius * (item.value / 100);
    return {
      x: center + Math.cos(angle) * valueRadius,
      y: center + Math.sin(angle) * valueRadius,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * labelRadius,
      labelY: center + Math.sin(angle) * labelRadius,
      label: item.label,
    };
  });
  const polygonPoints = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        {[0.33, 0.66, 1].map((scale) => (
          <Circle
            key={scale}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#D9DFEA"
            strokeWidth={1}
          />
        ))}
        {points.map((point) => (
          <Line
            key={`${point.label}-axis`}
            x1={center}
            y1={center}
            x2={point.axisX}
            y2={point.axisY}
            stroke="#D9DFEA"
            strokeWidth={1}
          />
        ))}
        <Polygon points={polygonPoints} fill="rgba(92, 77, 255, 0.22)" stroke="#5C4DFF" strokeWidth={3} />
        {points.map((point) => (
          <SvgText
            key={point.label}
            x={point.labelX}
            y={point.labelY}
            fill="#303440"
            fontSize={11}
            fontWeight="700"
            textAnchor="middle"
          >
            {point.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
