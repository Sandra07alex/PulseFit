import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clay, clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';

export interface ClayBarDatum {
  label: string;
  value: number;
}

export interface ClayBarsProps {
  data: ClayBarDatum[];
  tint?: ClayTint;
  height?: number;
  /** Optional goal drawn as a dashed line; bars reaching it get a ⭐ */
  goal?: number;
  /** Formats the value printed above the highlighted (last) bar */
  formatValue?: (v: number) => string;
}

const Bar: React.FC<{
  value: number;
  max: number;
  height: number;
  tint: ClayTint;
  highlight: boolean;
  delay: number;
}> = ({ value, max, height, tint, highlight, delay }) => {
  const grow = useRef(new Animated.Value(0)).current;
  const target = max > 0 ? Math.max(value > 0 ? 0.06 : 0, value / max) : 0;

  useEffect(() => {
    Animated.spring(grow, { toValue: target, delay, tension: 50, friction: 8, useNativeDriver: false }).start();
  }, [target, delay, grow]);

  const t = clayTints[highlight ? tint : 'cloud'];
  const barHeight = grow.interpolate({ inputRange: [0, 1], outputRange: [0, height] });

  return (
    <Animated.View style={[styles.bar, { height: barHeight }]}>
      {/* lip */}
      <View style={[StyleSheet.absoluteFill, styles.barRadius, { top: 4, backgroundColor: highlight ? t.lip : '#D9D0F5' }]} />
      <LinearGradient
        colors={highlight ? t.face : ['#E9E3FF', '#C9BDFF']}
        style={[styles.barFace, styles.barRadius]}
      >
        <View style={styles.barGloss} />
      </LinearGradient>
    </Animated.View>
  );
};

/** Chunky 3D bar chart, used for weekly summaries */
export const ClayBars: React.FC<ClayBarsProps> = ({ data, tint = 'pulse', height = 120, goal, formatValue }) => {
  const max = Math.max(goal ?? 0, ...data.map((d) => d.value), 1);
  const last = data.length - 1;

  return (
    <View>
      <View style={[styles.plot, { height: height + 22 }]}>
        {goal ? (
          <View style={[styles.goalLine, { bottom: (goal / max) * height }]}>
            <Text style={styles.goalText}>goal</Text>
          </View>
        ) : null}
        {data.map((d, i) => (
          <View key={`${d.label}-${i}`} style={styles.col}>
            <Text style={[styles.value, i === last && { color: clayTints[tint].accent }]}>
              {i === last || (goal && d.value >= goal)
                ? goal && d.value >= goal
                  ? '⭐'
                  : formatValue
                  ? formatValue(d.value)
                  : String(Math.round(d.value))
                : ''}
            </Text>
            <Bar value={d.value} max={max} height={height} tint={tint} highlight={i === last} delay={i * 60} />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {data.map((d, i) => (
          <Text key={`${d.label}-l${i}`} style={[styles.label, i === last && { color: clay.ink.primary }]}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  plot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  value: {
    fontFamily: typography.fonts.display,
    fontSize: 11,
    color: clay.ink.secondary,
    marginBottom: 4,
    height: 16,
  },
  bar: {
    width: '78%',
    paddingBottom: 4,
  },
  barRadius: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  barFace: {
    flex: 1,
    overflow: 'hidden',
  },
  barGloss: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 5,
    bottom: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CFC5F2',
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: -16,
    fontFamily: typography.fonts.displayMedium,
    fontSize: 10,
    color: clay.ink.tertiary,
  },
  labels: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 12,
    color: clay.ink.tertiary,
  },
});
