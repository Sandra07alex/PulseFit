/**
 * @file DailyNutritionHeader.tsx
 * @description Hero card at the top of the Food screen.
 *
 * Displays:
 *  - Date label
 *  - Calorie ring (animated arc)
 *  - Macro pills (Protein, Carbs, Fat, Fiber)
 *  - Remaining vs Goal
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors }    from '../../../theme/colors';
import { radius }    from '../../../theme/radius';
import { spacing }   from '../../../theme/spacing';
import { shadows }   from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import type { NutritionProgress } from '../types/food.types';

// ---------------------------------------------------------------------------
// Animated calorie number
// ---------------------------------------------------------------------------

const AnimatedNumber: React.FC<{ value: number; style?: object }> = ({
  value,
  style,
}) => {
  const anim    = useRef(new Animated.Value(0)).current;
  const [disp, setDisp] = React.useState(0);

  useEffect(() => {
    anim.addListener(({ value: v }) => setDisp(Math.round(v)));
    Animated.timing(anim, {
      toValue: value,
      duration: 900,
      useNativeDriver: false,
    }).start();
    return () => anim.removeAllListeners();
  }, [value]);

  return <Text style={style}>{disp.toLocaleString()}</Text>;
};

// ---------------------------------------------------------------------------
// Macro pill
// ---------------------------------------------------------------------------

const MacroPill: React.FC<{
  label: string;
  value: number;
  goal: number;
  unit: string;
  color: string;
}> = ({ label, value, goal, unit, color }) => (
  <View style={styles.macroPill}>
    <View style={[styles.macroDot, { backgroundColor: color }]} />
    <View style={styles.macroText}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={[styles.macroValue, { color }]}>
        {Math.round(value * 10) / 10}
        <Text style={styles.macroUnit}>{unit}</Text>
      </Text>
      <Text style={styles.macroGoal}>/ {goal}{unit}</Text>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Animated progress arc (simplified ring using bar)
// ---------------------------------------------------------------------------

const CalorieRing: React.FC<{
  percentage: number;
  calories: number;
  remaining: number;
  goal: number;
}> = ({ percentage, calories, remaining, goal }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: Math.min(percentage, 100),
      tension: 80,
      friction: 12,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const width = widthAnim.interpolate({
    inputRange:  [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.ringContainer}>
      {/* Central calorie display */}
      <View style={styles.ringCenter}>
        <AnimatedNumber
          value={calories}
          style={styles.ringCalories}
        />
        <Text style={styles.ringLabel}>kcal eaten</Text>
        <Text style={styles.ringRemaining}>{remaining} left</Text>
      </View>

      {/* Progress arc bar */}
      <View style={styles.progressTrackWide}>
        <Animated.View
          style={[
            styles.progressFillWide,
            { width },
          ]}
        />
        <Text style={styles.goalText}>Goal: {goal.toLocaleString()} kcal</Text>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// DailyNutritionHeader
// ---------------------------------------------------------------------------

export interface DailyNutritionHeaderProps {
  progress: NutritionProgress;
}

export const DailyNutritionHeader: React.FC<DailyNutritionHeaderProps> = ({
  progress,
}) => {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.dateLabel}>{today}</Text>
            <Text style={styles.title}>Today's Nutrition</Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              {progress.percentages.calories}%
            </Text>
          </View>
        </View>

        {/* Calorie ring */}
        <CalorieRing
          percentage={progress.percentages.calories}
          calories={progress.totals.calories}
          remaining={progress.remaining.calories}
          goal={progress.goals.calories}
        />

        {/* Macro pills */}
        <View style={styles.macroRow}>
          <MacroPill
            label="Protein"
            value={progress.totals.protein}
            goal={progress.goals.protein}
            unit="g"
            color="#FFB703"
          />
          <MacroPill
            label="Carbs"
            value={progress.totals.carbs}
            goal={progress.goals.carbs}
            unit="g"
            color="#00D4FF"
          />
          <MacroPill
            label="Fat"
            value={progress.totals.fat}
            goal={progress.goals.fat}
            unit="g"
            color="#FF6B81"
          />
          <MacroPill
            label="Fiber"
            value={progress.totals.fiber}
            goal={progress.goals.fiber}
            unit="g"
            color="#2A9D8F"
          />
        </View>
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
  },
  card: {
    borderRadius: radius.heroCard,
    padding: spacing['2xl'],
    gap: spacing.xl,
    backgroundColor: colors.primary,
    ...shadows.lg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.5,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  scoreText: {
    fontSize: typography.sizes.base,
    fontWeight: '800',
    color: colors.white,
  },
  ringContainer: {
    gap: spacing.md,
  },
  ringCenter: {
    alignItems: 'center',
    gap: 2,
  },
  ringCalories: {
    fontSize: typography.sizes['5xl'],
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -2,
  },
  ringLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
  },
  ringRemaining: {
    fontSize: typography.sizes.base,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  progressTrackWide: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    height: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFillWide: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.pill,
  },
  goalText: {
    position: 'absolute',
    right: 0,
    top: 14,
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  macroDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    marginTop: 4,
  },
  macroText: {
    gap: 1,
  },
  macroLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  macroValue: {
    fontSize: typography.sizes.base,
    fontWeight: '800',
  },
  macroUnit: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
  },
  macroGoal: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
});
