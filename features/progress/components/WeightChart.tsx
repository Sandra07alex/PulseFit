import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { ClayLabel } from '../../../components/clay';
import { clayTints } from '../../../theme/clay';
import type { WeightLog } from '../../../types/models';

const HEIGHT = 170;
const PAD = { top: 18, bottom: 26, left: 8, right: 8 };
const t = clayTints.pulse;

function shortDate(key: string): string {
  const [, m, d] = key.split('-').map(Number);
  return `${d}/${m}`;
}

export const WeightChart: React.FC<{ logs: WeightLog[]; target?: number }> = ({ logs, target }) => {
  const [width, setWidth] = useState(0);
  const points = logs.slice(-14);

  if (points.length < 2) {
    return (
      <View style={styles.placeholder}>
        <ClayLabel style={{ textAlign: 'center' }}>
          Log your weight on two different days to see your trend line ✨
        </ClayLabel>
      </View>
    );
  }

  const values = points.map((p) => p.weightKg);
  const withTarget = target ? [...values, target] : values;
  const min = Math.min(...withTarget) - 0.5;
  const max = Math.max(...withTarget) + 0.5;

  const innerW = Math.max(1, width - PAD.left - PAD.right);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (points.length - 1)) * innerW;
  const y = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;

  // smooth curve through the points (simple cubic with horizontal tangents)
  const path = points
    .map((p, i) => {
      if (i === 0) return `M ${x(0)} ${y(p.weightKg)}`;
      const px = x(i - 1);
      const py = y(points[i - 1].weightKg);
      const cx = (px + x(i)) / 2;
      return `C ${cx} ${py} ${cx} ${y(p.weightKg)} ${x(i)} ${y(p.weightKg)}`;
    })
    .join(' ');
  const area = `${path} L ${x(points.length - 1)} ${HEIGHT - PAD.bottom} L ${x(0)} ${HEIGHT - PAD.bottom} Z`;

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)} style={{ height: HEIGHT }}>
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          <Defs>
            <LinearGradient id="wArea" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={t.face[1]} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={t.face[1]} stopOpacity={0} />
            </LinearGradient>
            <LinearGradient id="wLine" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={t.face[0]} />
              <Stop offset="100%" stopColor={t.accent} />
            </LinearGradient>
          </Defs>

          {target ? (
            <>
              <Line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(target)}
                y2={y(target)}
                stroke={clayTints.brocco.accent}
                strokeWidth={2}
                strokeDasharray="6 6"
              />
              <SvgText x={width - PAD.right} y={y(target) - 6} fontSize="10" fill={clayTints.brocco.accent} textAnchor="end">
                🎯 {target} kg
              </SvgText>
            </>
          ) : null}

          <Path d={area} fill="url(#wArea)" />
          {/* drop shadow, then the raised line, then a gloss stripe */}
          <Path d={path} stroke={t.lip} strokeOpacity={0.35} strokeWidth={8} fill="none" strokeLinecap="round" transform="translate(0 4)" />
          <Path d={path} stroke="url(#wLine)" strokeWidth={8} fill="none" strokeLinecap="round" />
          <Path d={path} stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={2} fill="none" strokeLinecap="round" transform="translate(0 -2)" />

          {points.map((p, i) => {
            const last = i === points.length - 1;
            const r = last ? 9 : 6;
            return (
              <React.Fragment key={p.id}>
                <Circle cx={x(i)} cy={y(p.weightKg) + 3} r={r} fill={t.lip} opacity={0.5} />
                <Circle cx={x(i)} cy={y(p.weightKg)} r={r} fill={last ? t.accent : '#FFFFFF'} stroke={t.accent} strokeWidth={3} />
                <Circle cx={x(i) - r * 0.3} cy={y(p.weightKg) - r * 0.35} r={r * 0.3} fill="#FFFFFF" opacity={0.85} />
                {(i === 0 || last) && (
                  <SvgText
                    x={x(i)}
                    y={HEIGHT - 8}
                    fontSize="10"
                    fill="#6E6491"
                    textAnchor={i === 0 ? 'start' : 'end'}
                  >
                    {shortDate(p.date)}
                  </SvgText>
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
