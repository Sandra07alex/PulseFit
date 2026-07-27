/**
 * @file FoodSearchItem.tsx
 * @description Compact row item in the food search results list.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import { CATEGORY_EMOJI } from '../types/food.types';
import type { FoodCatalogItem } from '../types/food.types';

interface FoodSearchItemProps {
  item:          FoodCatalogItem;
  onPress:       (item: FoodCatalogItem) => void;
  onFavorite?:   (item: FoodCatalogItem) => void;
}

export const FoodSearchItem: React.FC<FoodSearchItemProps> = ({
  item,
  onPress,
  onFavorite,
}) => (
  <TouchableOpacity
    style={styles.row}
    onPress={() => onPress(item)}
    activeOpacity={0.75}
    accessibilityRole="button"
    accessibilityLabel={`${item.name}, ${item.calories} calories per ${item.servingSize}${item.servingUnit}`}
  >
    {/* Category icon */}
    <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
      <Text style={styles.icon}>{CATEGORY_EMOJI[item.category]}</Text>
    </View>

    {/* Info */}
    <View style={styles.info}>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.meta}>
        {item.brand ? `${item.brand} · ` : ''}
        {item.servingSize}{item.servingUnit} · {item.category}
      </Text>
    </View>

    {/* Calories */}
    <View style={styles.right}>
      <Text style={styles.calories}>{item.calories}</Text>
      <Text style={styles.caloriesUnit}>kcal</Text>
    </View>

    {/* Favorite star */}
    {onFavorite && (
      <TouchableOpacity
        onPress={() => onFavorite(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityLabel={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Text style={[styles.star, item.isFavorite && styles.starActive]}>
          {item.isFavorite ? '★' : '☆'}
        </Text>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap:            spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    backgroundColor: colors.lightMode.surface,
  },
  iconWrap: {
    width:           40,
    height:          40,
    borderRadius:    radius.sm,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  icon: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    gap:  2,
  },
  name: {
    fontSize:    typography.sizes.base,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.1,
  },
  meta: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    gap:        1,
  },
  calories: {
    fontSize:   typography.sizes.lg,
    fontWeight: '800',
    color:      colors.primary,
  },
  caloriesUnit: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
  },
  star: {
    fontSize:  22,
    color:     colors.gray300,
  },
  starActive: {
    color: colors.companions.eggsy.primary,
  },
});
