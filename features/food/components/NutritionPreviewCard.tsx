/**
 * @file NutritionPreviewCard.tsx
 * @description Live-updating nutrition preview as quantity changes.
 * Shows Calories, Protein, Carbs, Fat, Fiber with animated number transitions.
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
import type { NutritionTotals } from '../types/food.types';

const AnimNum: React.FC<{ value: number; decimals?: number; style?: object }> = ({
  value,
  decimals = 0,
  style,
}) => {
  const anim   = useRef(new Animated.Value(value)).current;
  const [disp, setDisp] = React.useState(value);

  useEffect(() => {
    anim.addListener(({ value: v }) =>
      setDisp(decimals ? Math.round(v * 10) / 10 : Math.round(v))
    );
    Animated.timing(anim, {
      toValue: value,
      duration: 350,
      useNativeDriver: false,
    }).start();
    return () => anim.removeAllListeners();
  }, [value, decimals]);

  return <Text style={style}>{decimals ? disp.toFixed(1) : disp}</Text>;
};

interface MacroRowProps {
  label:  string;
  value:  number;
  unit:   string;
  color:  string;
}

const MacroRow: React.FC<MacroRowProps> = ({ label, value, unit, color }) => (
  <View style={styles.macroRow}>
    <View style={[styles.macroDot, { backgroundColor: color }]} />
    <Text style={styles.macroLabel}>{label}</Text>
    <View style={styles.macroValueWrap}>
      <AnimNum value={value} decimals={1} style={[styles.macroValue, { color }]} />
      <Text style={styles.macroUnit}>{unit}</Text>
    </View>
  </View>
);

interface NutritionPreviewCardProps {
  nutrition: NutritionTotals;
  foodName:  string;
  quantity:  number;
  unit:      string;
}

export const NutritionPreviewCard: React.FC<NutritionPreviewCardProps> = ({
  nutrition,
  foodName,
  quantity,
  unit,
}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.foodName} numberOfLines={1}>{foodName}</Text>
      <View style={styles.servingBadge}>
        <Text style={styles.servingText}>{quantity}{unit}</Text>
      </View>
    </View>

    {/* Calorie big number */}
    <View style={styles.calorieRow}>
      <AnimNum value={nutrition.calories} style={styles.calorieNumber} />
      <Text style={styles.calorieUnit}>kcal</Text>
    </View>

    <View style={styles.divider} />

    {/* Macros */}
    <MacroRow label="Protein" value={nutrition.protein} unit="g" color={colors.companions.eggsy.primary} />
    <MacroRow label="Carbs"   value={nutrition.carbs}   unit="g" color={colors.companions.droppy.primary} />
    <MacroRow label="Fat"     value={nutrition.fat}     unit="g" color={colors.companions.blaze.primary} />
    <MacroRow label="Fiber"   value={nutrition.fiber}   unit="g" color={colors.companions.brocco.primary} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.card,
    padding:         spacing.xl,
    gap:             spacing.md,
    ...shadows.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            spacing.md,
  },
  foodName: {
    flex:        1,
    fontSize:    typography.sizes.lg,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.3,
  },
  servingBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius:    radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical:   4,
  },
  servingText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.primary,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems:    'baseline',
    gap:           6,
  },
  calorieNumber: {
    fontSize:    typography.sizes['6xl'],
    fontWeight:  '900',
    color:       colors.primary,
    letterSpacing: -2,
  },
  calorieUnit: {
    fontSize:  typography.sizes.xl,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
  },
  divider: {
    height:          1,
    backgroundColor: colors.lightMode.border,
  },
  macroRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing.sm,
  },
  macroDot: {
    width:        8,
    height:       8,
    borderRadius: radius.full,
  },
  macroLabel: {
    flex:      1,
    fontSize:  typography.sizes.base,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
  },
  macroValueWrap: {
    flexDirection: 'row',
    alignItems:    'baseline',
    gap:           2,
  },
  macroValue: {
    fontSize:   typography.sizes.lg,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  macroUnit: {
    fontSize:  typography.sizes.sm,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
  },
});
