/**
 * @file ProgressCard.tsx
 * @description Single animated metric progress card.
 *
 * Features:
 *  - Animated number count-up on mount
 *  - Animated LinearProgress bar
 *  - Card lift on touch
 *  - Companion accent colour
 *  - Percentage badge
 *  - Remaining label
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import { useCardLiftAnimation } from '../../../hooks/useMotion';
import type { MetricProgress } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Animated progress bar (internal)
// ---------------------------------------------------------------------------

const AnimatedProgressBar: React.FC<{
  percentage: number;
  color: string;
  trackColor: string;
  height?: number;
}> = ({ percentage, color, trackColor, height = 8 }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: Math.min(percentage, 100),
      tension: 80,
      friction: 12,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const widthPct = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.progressTrack, { height, backgroundColor: trackColor }]}>
      <Animated.View
        style={[
          styles.progressFill,
          { width: widthPct, backgroundColor: color, height },
        ]}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Animated counter (internal)
// ---------------------------------------------------------------------------

const AnimatedNumber: React.FC<{
  value: number;
  style?: object;
}> = ({ value, style }) => {
  const animVal = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    animVal.addListener(({ value: v }) => setDisplay(Math.round(v)));
    Animated.timing(animVal, {
      toValue: value,
      duration: 900,
      useNativeDriver: false,
    }).start();
    return () => animVal.removeAllListeners();
  }, [value]);

  return <Text style={style}>{display.toLocaleString()}</Text>;
};

// ---------------------------------------------------------------------------
// ProgressCard
// ---------------------------------------------------------------------------

export interface ProgressCardProps {
  metric: MetricProgress;
  onPress?: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ metric, onPress }) => {
  const { scale, translateY, handleTouchStart, handleTouchEnd } = useCardLiftAnimation();

  const trackColor = metric.softColor;
  const fillColor  = metric.accentColor;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale }, { translateY }],
          borderTopColor: fillColor,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`${metric.label}: ${metric.current} of ${metric.goal} ${metric.unit}`}
      >
        {/* Icon + Percentage badge */}
        <View style={styles.topRow}>
          <View style={[styles.iconWrap, { backgroundColor: metric.softColor }]}>
            <Text style={styles.icon}>{metric.icon}</Text>
          </View>
          <View style={[styles.percentBadge, { backgroundColor: fillColor + '18' }]}>
            <Text style={[styles.percentText, { color: fillColor }]}>
              {metric.percentage}%
            </Text>
          </View>
        </View>

        {/* Label */}
        <Text style={styles.label}>{metric.label}</Text>

        {/* Current / Goal */}
        <View style={styles.valueRow}>
          <AnimatedNumber value={metric.current} style={[styles.currentValue, { color: fillColor }]} />
          <Text style={styles.separator}> / </Text>
          <Text style={styles.goalValue}>{metric.goal.toLocaleString()}</Text>
          <Text style={styles.unit}> {metric.unit}</Text>
        </View>

        {/* Progress bar */}
        <AnimatedProgressBar
          percentage={metric.percentage}
          color={fillColor}
          trackColor={trackColor}
        />

        {/* Remaining label */}
        <Text style={styles.remainingText}>{metric.remainingLabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.lightMode.surface,
    borderRadius: radius.card,
    borderTopWidth: 3,
    ...shadows.card,
    overflow: 'hidden',
  },
  touchable: {
    padding: spacing.lg,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  percentText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.lightMode.textSecondary,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  separator: {
    fontSize: 14,
    color: colors.gray300,
    fontWeight: '400',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.lightMode.textTertiary,
  },
  unit: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.lightMode.textTertiary,
  },
  progressTrack: {
    width: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressFill: {
    borderRadius: radius.pill,
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.lightMode.textSecondary,
    marginTop: 2,
  },
});
