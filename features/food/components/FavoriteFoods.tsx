/**
 * @file FavoriteFoods.tsx
 * @description Horizontal scroll strip of favorited foods.
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

interface FavoriteFoodsProps {
  foods:      FoodCatalogItem[];
  onSelect:   (food: FoodCatalogItem) => void;
  onFavorite: (food: FoodCatalogItem) => void;
}

const FavChip: React.FC<{
  food:      FoodCatalogItem;
  onPress:   () => void;
  onFav:     () => void;
}> = ({ food, onPress, onFav }) => (
  <TouchableOpacity
    style={styles.chip}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={`Favorite: ${food.name}`}
  >
    <TouchableOpacity
      style={styles.starBtn}
      onPress={onFav}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      accessibilityLabel="Remove from favorites"
    >
      <Text style={styles.star}>★</Text>
    </TouchableOpacity>
    <Text style={styles.emoji}>{CATEGORY_EMOJI[food.category]}</Text>
    <Text style={styles.name} numberOfLines={2}>{food.name}</Text>
    <Text style={styles.cal}>{food.calories} kcal</Text>
  </TouchableOpacity>
);

export const FavoriteFoods: React.FC<FavoriteFoodsProps> = ({
  foods,
  onSelect,
  onFavorite,
}) => {
  if (foods.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>⭐ Favourites</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        {foods.map((food) => (
          <FavChip
            key={food.id}
            food={food}
            onPress={() => onSelect(food)}
            onFav={() => onFavorite(food)}
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
    fontSize:    typography.sizes.base,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    paddingHorizontal: spacing.screenPadding,
    letterSpacing: -0.2,
  },
  list: {
    paddingHorizontal: spacing.screenPadding,
    gap:               spacing.sm,
    flexDirection:     'row',
  },
  chip: {
    width:          90,
    backgroundColor: colors.companions.eggsy.soft,
    borderRadius:   radius.cardSmall,
    padding:        spacing.md,
    alignItems:     'center',
    gap:            4,
    ...shadows.sm,
    position:       'relative',
  },
  starBtn: {
    position: 'absolute',
    top:      6,
    right:    6,
  },
  star: {
    fontSize: 14,
    color:    colors.companions.eggsy.primary,
  },
  emoji: {
    fontSize: 22,
    marginTop: spacing.sm,
  },
  name: {
    fontSize:  typography.sizes.xs,
    fontWeight: '600',
    color:     colors.lightMode.text,
    textAlign: 'center',
  },
  cal: {
    fontSize:  typography.sizes.xs,
    fontWeight: '700',
    color:     colors.companions.eggsy.primary,
  },
});
