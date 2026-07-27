/**
 * @file FoodCategoryTabs.tsx
 * @description Horizontal scrollable category filter chips.
 */

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { FOOD_CATEGORIES, CATEGORY_EMOJI } from '../types/food.types';
import type { FoodCategory } from '../types/food.types';

interface FoodCategoryTabsProps {
  selected:  FoodCategory | null;
  onSelect:  (cat: FoodCategory | null) => void;
}

const CategoryChip: React.FC<{
  label:     FoodCategory | 'All';
  emoji:     string;
  isActive:  boolean;
  onPress:   () => void;
}> = ({ label, emoji, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.92, useNativeDriver: true, tension: 200, friction: 10,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1, useNativeDriver: true, tension: 180, friction: 8,
      }),
    ]).start();
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Filter by ${label}`}
        accessibilityState={{ selected: isActive }}
      >
        <Text style={styles.chipEmoji}>{emoji}</Text>
        <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const FoodCategoryTabs: React.FC<FoodCategoryTabsProps> = ({
  selected,
  onSelect,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.list}
    style={styles.scroll}
  >
    {/* All categories chip */}
    <CategoryChip
      label="All"
      emoji="🌟"
      isActive={selected === null}
      onPress={() => onSelect(null)}
    />

    {FOOD_CATEGORIES.map((cat) => (
      <CategoryChip
        key={cat}
        label={cat}
        emoji={CATEGORY_EMOJI[cat]}
        isActive={selected === cat}
        onPress={() => onSelect(selected === cat ? null : cat)}
      />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  list: {
    paddingHorizontal: spacing.screenPadding,
    gap:               spacing.sm,
    flexDirection:     'row',
    alignItems:        'center',
  },
  chip: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs + 2,
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.pill,
    borderWidth:     1.5,
    borderColor:     colors.lightMode.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor:     colors.primary,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipLabel: {
    fontSize:   typography.sizes.sm,
    fontWeight: '600',
    color:      colors.lightMode.textSecondary,
  },
  chipLabelActive: {
    color: colors.white,
  },
});
