/**
 * @file NutritionSummary.tsx
 * @description Animated progress bars for Calories, Protein, Carbs, Fat, Fiber.
 * Compares against profile goals and shows consumed/remaining/percentage.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import type { NutritionProgress } from '../types/food.types';

interface MacroBarProps {
  label:      string;
  consumed:   number;
  goal:       number;
  unit:       string;
  percentage: number;
  color:      string;
  softColor:  string;
}

const MacroBar: React.FC<MacroBarProps> = ({
  label,
  consumed,
  goal,
  unit,
  percentage,
  color,
  softColor,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue:         Math.min(percentage, 100),
      tension:         80,
      friction:        12,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const width = widthAnim.interpolate({
    inputRange:  [0, 100],
    outputRange: ['0%', '100%'],
  });

  const isOver = consumed > goal;

  return (
    <View style={styles.barRow}>
      <View style={styles.barMeta}>
        <Text style={styles.barLabel}>{label}</Text>
        <View style={styles.barValues}>
          <Text style={[styles.barConsumed, { color }]}>{Math.round(consumed * 10) / 10}{unit}</Text>
          <Text style={styles.barSep}> / </Text>
          <Text style={styles.barGoal}>{goal}{unit}</Text>
          <View style={[styles.pctBadge, { backgroundColor: isOver ? colors.errorSoft : softColor }]}>
            <Text style={[styles.pctText, { color: isOver ? colors.error : color }]}>
              {percentage}%
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.track, { backgroundColor: softColor }]}>
        <Animated.View
          style={[
            styles.fill,
            { width, backgroundColor: isOver ? colors.error : color },
          ]}
        />
      </View>
    </View>
  );
};

interface NutritionSummaryProps {
  progress: NutritionProgress;
}

export const NutritionSummary: React.FC<NutritionSummaryProps> = ({ progress }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>📊 Today's Macros</Text>

    <MacroBar
      label="Calories"
      consumed={progress.totals.calories}
      goal={progress.goals.calories}
      unit=" kcal"
      percentage={progress.percentages.calories}
      color={colors.companions.blaze.primary}
      softColor={colors.companions.blaze.soft}
    />
    <MacroBar
      label="Protein"
      consumed={progress.totals.protein}
      goal={progress.goals.protein}
      unit="g"
      percentage={progress.percentages.protein}
      color={colors.companions.eggsy.primary}
      softColor={colors.companions.eggsy.soft}
    />
    <MacroBar
      label="Carbs"
      consumed={progress.totals.carbs}
      goal={progress.goals.carbs}
      unit="g"
      percentage={progress.percentages.carbs}
      color={colors.companions.droppy.primary}
      softColor={colors.companions.droppy.soft}
    />
    <MacroBar
      label="Fat"
      consumed={progress.totals.fat}
      goal={progress.goals.fat}
      unit="g"
      percentage={progress.percentages.fat}
      color={colors.companions.blaze.light}
      softColor={colors.companions.blaze.soft}
    />
    <MacroBar
      label="Fiber"
      consumed={progress.totals.fiber}
      goal={progress.goals.fiber}
      unit="g"
      percentage={progress.percentages.fiber}
      color={colors.companions.brocco.primary}
      softColor={colors.companions.brocco.soft}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor:  colors.lightMode.surface,
    borderRadius:     radius.card,
    padding:          spacing.xl,
    gap:              spacing.lg,
    ...shadows.card,
  },
  cardTitle: {
    fontSize:    typography.sizes.lg,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.3,
  },
  barRow: {
    gap: spacing.sm,
  },
  barMeta: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  barLabel: {
    fontSize:  typography.sizes.sm,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  barValues: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           4,
  },
  barConsumed: {
    fontSize:   typography.sizes.base,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  barSep: {
    fontSize: typography.sizes.sm,
    color:    colors.gray300,
  },
  barGoal: {
    fontSize:  typography.sizes.sm,
    fontWeight: '600',
    color:     colors.lightMode.textTertiary,
  },
  pctBadge: {
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      radius.pill,
    marginLeft:        4,
  },
  pctText: {
    fontSize:  10,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  track: {
    height:       8,
    borderRadius: radius.pill,
    overflow:     'hidden',
    width:        '100%',
  },
  fill: {
    height:       '100%',
    borderRadius: radius.pill,
  },
});
