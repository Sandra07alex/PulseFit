/**
 * @file MealSection.tsx
 * @description Collapsible meal section (Breakfast / Lunch / Dinner / Snacks).
 *
 * Shows:
 *  - Meal header with name, emoji, total calories, protein
 *  - List of FoodLogCard items
 *  - EmptyMealState when no items logged
 *  - "Add Food" button at the bottom
 *  - Collapsible with animated expand/collapse
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { FoodLogCard }    from './FoodLogCard';
import { EmptyMealState } from './EmptyMealState';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import { MEAL_EMOJI } from '../types/food.types';
import type { MealGroup, FoodLogEntry } from '../types/food.types';

interface MealSectionProps {
  group:      MealGroup;
  onAddFood:  () => void;
  onEdit:     (entry: FoodLogEntry) => void;
  onDelete:   (entry: FoodLogEntry) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  group,
  onAddFood,
  onEdit,
  onDelete,
}) => {
  const [expanded,  setExpanded]  = useState(true);
  const heightAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heightAnim, {
        toValue:         expanded ? 1 : 0,
        useNativeDriver: false,
        tension:         120,
        friction:        16,
      }),
      Animated.timing(rotateAnim, {
        toValue:         expanded ? 0 : 1,
        duration:        200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [expanded]);

  const rotate = rotateAnim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const hasEntries = group.entries.length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${group.mealType} section, ${group.totals.calories} calories`}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.mealIconWrap, { backgroundColor: colors.primarySoft }]}>
            <Text style={styles.mealIcon}>{MEAL_EMOJI[group.mealType]}</Text>
          </View>
          <View>
            <Text style={styles.mealName}>{group.mealType}</Text>
            {hasEntries && (
              <Text style={styles.mealSub}>
                {group.entries.length} item{group.entries.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.headerRight}>
          {hasEntries && (
            <View>
              <Text style={styles.mealCalories}>{group.totals.calories} kcal</Text>
              <Text style={styles.mealProtein}>
                {Math.round(group.totals.protein * 10) / 10}g protein
              </Text>
            </View>
          )}
          <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>
            ›
          </Animated.Text>
        </View>
      </TouchableOpacity>

      {/* Body */}
      {expanded && (
        <View style={styles.body}>
          {hasEntries ? (
            <>
              {group.entries.map((entry) => (
                <FoodLogCard
                  key={entry.id}
                  entry={entry}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              <TouchableOpacity
                style={styles.addMore}
                onPress={onAddFood}
                accessibilityRole="button"
                accessibilityLabel={`Add more food to ${group.mealType}`}
              >
                <Text style={styles.addMoreText}>+ Add more</Text>
              </TouchableOpacity>
            </>
          ) : (
            <EmptyMealState
              mealType={group.mealType}
              onAddPress={onAddFood}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor:  colors.lightMode.surface,
    borderRadius:     radius.card,
    ...shadows.card,
    overflow: 'hidden',
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
  },
  mealIconWrap: {
    width:          40,
    height:         40,
    borderRadius:   radius.sm,
    alignItems:     'center',
    justifyContent: 'center',
  },
  mealIcon: {
    fontSize: 20,
  },
  mealName: {
    fontSize:    typography.sizes.lg,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.2,
  },
  mealSub: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.md,
  },
  mealCalories: {
    fontSize:   typography.sizes.base,
    fontWeight: '800',
    color:      colors.primary,
    textAlign:  'right',
    letterSpacing: -0.3,
  },
  mealProtein: {
    fontSize:  typography.sizes.xs,
    fontWeight: '600',
    color:     colors.companions.eggsy.primary,
    textAlign: 'right',
  },
  chevron: {
    fontSize:  22,
    fontWeight: '300',
    color:     colors.lightMode.textTertiary,
  },
  body: {
    gap:             spacing.xs,
    paddingBottom:   spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  addMore: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  addMoreText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.primary,
  },
});
