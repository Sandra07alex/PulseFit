/**
 * @file RecentFoods.tsx
 * @description Horizontal scroll strip of recently used foods.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import { CATEGORY_EMOJI } from '../types/food.types';
import type { FoodCatalogItem } from '../types/food.types';

interface RecentFoodsProps {
  foods:    FoodCatalogItem[];
  onSelect: (food: FoodCatalogItem) => void;
}

const RecentFoodChip: React.FC<{
  food:    FoodCatalogItem;
  onPress: () => void;
}> = ({ food, onPress }) => (
  <TouchableOpacity
    style={styles.chip}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={`Recent: ${food.name}, ${food.calories} calories`}
  >
    <Text style={styles.chipEmoji}>{CATEGORY_EMOJI[food.category]}</Text>
    <Text style={styles.chipName} numberOfLines={2}>{food.name}</Text>
    <Text style={styles.chipCal}>{food.calories} kcal</Text>
  </TouchableOpacity>
);

export const RecentFoods: React.FC<RecentFoodsProps> = ({ foods, onSelect }) => {
  if (foods.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🕐 Recent</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {foods.map((food) => (
          <RecentFoodChip
            key={food.id}
            food={food}
            onPress={() => onSelect(food)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize:   typography.sizes.base,
    fontWeight: '700',
    color:      colors.lightMode.text,
    paddingHorizontal: spacing.screenPadding,
    letterSpacing: -0.2,
  },
  list: {
    paddingHorizontal: spacing.screenPadding,
    gap:               spacing.sm,
    flexDirection:     'row',
  },
  chip: {
    width:            90,
    backgroundColor:  colors.lightMode.surface,
    borderRadius:     radius.cardSmall,
    padding:          spacing.md,
    alignItems:       'center',
    gap:              4,
    ...shadows.sm,
  },
  chipEmoji: {
    fontSize: 22,
  },
  chipName: {
    fontSize:   typography.sizes.xs,
    fontWeight: '600',
    color:      colors.lightMode.text,
    textAlign:  'center',
  },
  chipCal: {
    fontSize:  typography.sizes.xs,
    fontWeight: '700',
    color:     colors.primary,
  },
});
