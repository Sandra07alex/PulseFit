import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { CompanionId } from '../mascot/types';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: string;
  companionId?: CompanionId;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendPositive = true,
  icon,
  companionId,
  color = colors.primary,
  onPress,
  style,
}) => {
  return (
    <Card variant="default" onPress={onPress} style={style}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{title}</Text>
          {trend && (
            <View
              style={[
                styles.trendBadge,
                { backgroundColor: trendPositive ? colors.successSoft : colors.errorSoft },
              ]}
            >
              <Text
                style={[
                  styles.trendText,
                  { color: trendPositive ? colors.success : colors.error },
                ]}
              >
                {trendPositive ? '↑ ' : '↓ '}
                {trend}
              </Text>
            </View>
          )}
        </View>

        {companionId ? (
          <Companion id={companionId} mood="idle" size="sm" animated={false} />
        ) : icon ? (
          <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.valueText, { color }]}>{value}</Text>
        {unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray600,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  valueText: {
    fontSize: 32,
    fontWeight: '800',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
  },
});
