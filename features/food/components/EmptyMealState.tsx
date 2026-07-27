/**
 * @file EmptyMealState.tsx
 * @description Friendly empty state for a meal section with no logged items.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { MEAL_EMPTY_MESSAGE, MEAL_EMOJI } from '../types/food.types';
import type { MealType } from '../types/food.types';

interface EmptyMealStateProps {
  mealType:   MealType;
  onAddPress: () => void;
}

export const EmptyMealState: React.FC<EmptyMealStateProps> = ({
  mealType,
  onAddPress,
}) => (
  <TouchableOpacity
    style={styles.container}
    onPress={onAddPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={`Add food to ${mealType}`}
  >
    <Text style={styles.emoji}>{MEAL_EMOJI[mealType]}</Text>
    <Text style={styles.message}>{MEAL_EMPTY_MESSAGE[mealType]}</Text>
    <Text style={styles.cta}>+ Add Food</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 20,
  },
  message: {
    flex: 1,
    fontSize: typography.sizes.base,
    color: colors.lightMode.textSecondary,
    fontWeight: '500',
  },
  cta: {
    fontSize: typography.sizes.sm,
    fontWeight: '700',
    color: colors.primary,
  },
});
