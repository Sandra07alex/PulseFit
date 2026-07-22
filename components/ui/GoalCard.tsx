import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { LinearProgress } from './LinearProgress';
import { colors } from '../../theme/colors';

export interface GoalCardProps {
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon?: string;
  accentColor?: string;
  style?: ViewStyle;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  currentValue,
  targetValue,
  unit,
  icon = '🎯',
  accentColor = colors.primary,
  style,
}) => {
  const percentage = Math.min(100, Math.round((currentValue / targetValue) * 100));
  const isCompleted = percentage >= 100;

  return (
    <Card variant="default" style={style}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.icon}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <Companion
          id="pulse"
          mood={isCompleted ? 'celebrate' : 'idle'}
          size="sm"
          animated={isCompleted}
        />
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.currentText, { color: accentColor }]}>
          {currentValue} <Text style={styles.targetText}>/ {targetValue} {unit}</Text>
        </Text>
      </View>

      <LinearProgress progress={percentage} color={accentColor} height={10} />
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
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
  },
  valueRow: {
    marginBottom: 10,
  },
  currentText: {
    fontSize: 22,
    fontWeight: '800',
  },
  targetText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
  },
});
