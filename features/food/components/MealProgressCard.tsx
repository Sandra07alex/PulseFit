/**
 * @file MealProgressCard.tsx
 * @description Per-meal progress card showing meal calorie consumed vs a target.
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
import { typography } from '../../../theme/typography';
import { MEAL_EMOJI } from '../types/food.types';
import type { MealGroup } from '../types/food.types';

interface MealProgressCardProps {
  group:        MealGroup;
  mealCalGoal:  number; // suggested calories for this meal
}

export const MealProgressCard: React.FC<MealProgressCardProps> = ({
  group,
  mealCalGoal,
}) => {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const pct = Math.min(
    Math.round((group.totals.calories / mealCalGoal) * 100),
    100
  );

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue:         pct,
      tension:         80,
      friction:        12,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const width = widthAnim.interpolate({
    inputRange:  [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.emoji}>{MEAL_EMOJI[group.mealType]}</Text>
        <View style={styles.info}>
          <Text style={styles.mealName}>{group.mealType}</Text>
          <Text style={styles.itemCount}>
            {group.entries.length} item{group.entries.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.calInfo}>
          <Text style={styles.consumed}>{group.totals.calories}</Text>
          <Text style={styles.goal}>/ {mealCalGoal} kcal</Text>
        </View>
      </View>

      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.cardSmall,
    padding:         spacing.md,
    gap:             spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  emoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  mealName: {
    fontSize:  typography.sizes.base,
    fontWeight: '700',
    color:     colors.lightMode.text,
  },
  itemCount: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
  },
  calInfo: {
    alignItems: 'flex-end',
  },
  consumed: {
    fontSize:   typography.sizes.lg,
    fontWeight: '800',
    color:      colors.primary,
    letterSpacing: -0.3,
  },
  goal: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
  },
  track: {
    height:          6,
    backgroundColor: colors.primarySoft,
    borderRadius:    radius.pill,
    overflow:        'hidden',
  },
  fill: {
    height:          '100%',
    backgroundColor: colors.primary,
    borderRadius:    radius.pill,
  },
});
