/**
 * @file FoodCard.tsx
 * @description Catalog food card for display in search results or lists.
 * Shows food name, brand, serving, calories, key macros, and an add button.
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
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import { CATEGORY_EMOJI } from '../types/food.types';
import { useCardLiftAnimation } from '../../../hooks/useMotion';
import type { FoodCatalogItem } from '../types/food.types';
import { Animated } from 'react-native';

interface FoodCardProps {
  food:       FoodCatalogItem;
  onAdd:      (food: FoodCatalogItem) => void;
  onFavorite: (food: FoodCatalogItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onAdd, onFavorite }) => {
  const { scale, translateY, handleTouchStart, handleTouchEnd } = useCardLiftAnimation();

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }, { translateY }] }]}>
      <TouchableOpacity
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
        onPress={() => onAdd(food)}
        activeOpacity={0.88}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`${food.name}, ${food.calories} calories per ${food.servingSize}${food.servingUnit}. Tap to add.`}
      >
        {/* Icon */}
        <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
          <Text style={styles.icon}>{CATEGORY_EMOJI[food.category]}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{food.name}</Text>
          {food.brand ? <Text style={styles.brand}>{food.brand}</Text> : null}
          <Text style={styles.serving}>
            Per {food.servingSize}{food.servingUnit}
          </Text>
          <View style={styles.macroChips}>
            <Text style={styles.macroChip}>🔥 {food.calories} kcal</Text>
            <Text style={styles.macroChip}>💪 {food.protein}g</Text>
            <Text style={styles.macroChip}>🌾 {food.carbs}g</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onFavorite(food)}
            style={styles.favBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel={food.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Text style={[styles.star, food.isFavorite && styles.starActive]}>
              {food.isFavorite ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
          <View style={styles.addBtn}>
            <Text style={styles.addBtnText}>+</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.card,
    ...shadows.card,
    overflow: 'hidden',
  },
  touchable: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       spacing.lg,
    gap:           spacing.md,
  },
  iconWrap: {
    width:           48,
    height:          48,
    borderRadius:    radius.md,
    alignItems:      'center',
    justifyContent:  'center',
    flexShrink:      0,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap:  3,
  },
  name: {
    fontSize:    typography.sizes.base,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.2,
  },
  brand: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
  },
  serving: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
    marginTop: 1,
  },
  macroChips: {
    flexDirection: 'row',
    gap:           6,
    flexWrap:      'wrap',
    marginTop:     4,
  },
  macroChip: {
    fontSize:   typography.sizes.xs,
    fontWeight: '600',
    color:      colors.lightMode.textSecondary,
  },
  actions: {
    alignItems: 'center',
    gap:        spacing.sm,
  },
  favBtn: {
    padding: 4,
  },
  star: {
    fontSize: 22,
    color:    colors.gray300,
  },
  starActive: {
    color: colors.companions.eggsy.primary,
  },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius:    radius.pill,
    width:           32,
    height:          32,
    alignItems:      'center',
    justifyContent:  'center',
  },
  addBtnText: {
    fontSize:  20,
    fontWeight: '700',
    color:     colors.white,
    lineHeight: 24,
  },
});
