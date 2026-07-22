import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { Button } from './Button';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface WaterCardProps {
  currentMl: number;
  targetMl: number;
  onAddWater?: (amountMl: number) => void;
  style?: ViewStyle;
}

export const WaterCard: React.FC<WaterCardProps> = ({
  currentMl,
  targetMl,
  onAddWater,
  style,
}) => {
  const percentage = Math.min(100, Math.round((currentMl / targetMl) * 100));

  return (
    <Card variant="default" style={style}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>💧 Hydration Tracker</Text>
        </View>
        <Companion id="droppy" mood={percentage >= 100 ? 'celebrate' : 'idle'} size="sm" animated={true} />
      </View>

      <View style={styles.progressTextRow}>
        <View>
          <Text style={styles.mlValue}>{currentMl} <Text style={styles.mlUnit}>/ {targetMl} ml</Text></Text>
          <Text style={styles.percentageText}>{percentage}% of daily goal completed</Text>
        </View>
      </View>

      {/* Water Fill Visual Bar */}
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>

      {onAddWater && (
        <View style={styles.quickAddRow}>
          <Button
            label="+250 ml"
            variant="quickAction"
            size="sm"
            onPress={() => onAddWater(250)}
          />
          <Button
            label="+500 ml"
            variant="quickAction"
            size="sm"
            onPress={() => onAddWater(500)}
          />
        </View>
      )}
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
  badge: {
    backgroundColor: colors.companions.droppy.soft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.companions.droppy.primary,
  },
  progressTextRow: {
    marginBottom: 12,
  },
  mlValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
  },
  mlUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray500,
  },
  percentageText: {
    fontSize: 13,
    color: colors.gray500,
    fontWeight: '500',
    marginTop: 2,
  },
  barBackground: {
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.companions.droppy.soft,
    overflow: 'hidden',
    marginBottom: 14,
  },
  barFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.companions.droppy.primary,
  },
  quickAddRow: {
    flexDirection: 'row',
    gap: 10,
  },
});
