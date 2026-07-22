import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface FoodCardProps {
  title: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  title,
  mealType,
  calories,
  proteinGrams,
  carbsGrams,
  fatGrams,
  onPress,
  style,
}) => {
  return (
    <Card variant="default" onPress={onPress} style={style}>
      <View style={styles.headerRow}>
        <View style={styles.mealBadge}>
          <Text style={styles.mealText}>{mealType}</Text>
        </View>
        <Companion id="brocco" mood="idle" size="sm" animated={false} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.caloriesRow}>
        <Text style={styles.calValue}>{calories}</Text>
        <Text style={styles.calLabel}>kcal</Text>
      </View>

      {/* Macro Breakdown Bar */}
      <View style={styles.macroPillRow}>
        <View style={[styles.macroChip, { backgroundColor: colors.companions.eggsy.soft }]}>
          <Text style={[styles.macroChipText, { color: colors.companions.eggsy.primary }]}>
            🥩 {proteinGrams}g Protein
          </Text>
        </View>
        <View style={[styles.macroChip, { backgroundColor: colors.companions.brocco.soft }]}>
          <Text style={[styles.macroChipText, { color: colors.companions.brocco.primary }]}>
            🌾 {carbsGrams}g Carbs
          </Text>
        </View>
        <View style={[styles.macroChip, { backgroundColor: colors.secondarySoft }]}>
          <Text style={[styles.macroChipText, { color: colors.secondary }]}>
            🥑 {fatGrams}g Fat
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealBadge: {
    backgroundColor: colors.companions.brocco.soft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  mealText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.companions.brocco.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 6,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  calValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.gray900,
  },
  calLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
  },
  macroPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  macroChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  macroChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
