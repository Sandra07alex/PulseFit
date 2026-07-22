import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { Button } from './Button';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface WorkoutCardProps {
  title: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity?: 'Low' | 'Moderate' | 'High' | 'Extreme';
  onStart?: () => void;
  style?: ViewStyle;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  title,
  category,
  durationMinutes,
  caloriesBurned,
  intensity = 'Moderate',
  onStart,
  style,
}) => {
  return (
    <Card variant="default" style={style}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <View style={[styles.intensityBadge, { backgroundColor: colors.companions.blaze.soft }]}>
            <Text style={[styles.intensityText, { color: colors.companions.blaze.primary }]}>
              {intensity}
            </Text>
          </View>
        </View>

        <Companion id="blaze" mood="idle" size="sm" animated={false} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⏱️</Text>
          <Text style={styles.statText}>{durationMinutes} mins</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statText}>{caloriesBurned} kcal</Text>
        </View>
      </View>

      {onStart && (
        <Button
          label="Start Workout"
          variant="primary"
          size="md"
          fullWidth
          onPress={onStart}
          style={{ marginTop: 14 }}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray700,
  },
  intensityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  intensityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: radius.md,
    padding: 10,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 16,
  },
  statText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.gray300,
  },
});
