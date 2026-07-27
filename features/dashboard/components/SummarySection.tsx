/**
 * @file SummarySection.tsx
 * @description Today's Summary section showing remaining values at a glance
 * and the animated Daily Score badge.
 *
 * Layout:
 *  - Section title
 *  - Horizontal row of 4 summary pills (Calories / Protein / Water / Workout)
 *  - Large Daily Score card with colour-coded tier
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import type { DailyScoreData } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Summary Pill
// ---------------------------------------------------------------------------

interface SummaryPillProps {
  icon: string;
  label: string;
  value: string;
  accentColor: string;
}

const SummaryPill: React.FC<SummaryPillProps> = ({ icon, label, value, accentColor }) => (
  <View style={[styles.pill, { borderColor: accentColor + '30', backgroundColor: accentColor + '0D' }]}>
    <Text style={styles.pillIcon}>{icon}</Text>
    <Text style={[styles.pillValue, { color: accentColor }]}>{value}</Text>
    <Text style={styles.pillLabel}>{label}</Text>
  </View>
);

// ---------------------------------------------------------------------------
// Animated Score ring
// ---------------------------------------------------------------------------

const ScoreDisplay: React.FC<{ score: number; color: string; label: string }> = ({
  score,
  color,
  label,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [score]);

  return (
    <Animated.View
      style={[
        styles.scoreCircle,
        { borderColor: color, transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      ]}
    >
      <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
      <Text style={styles.scoreSuffix}>/100</Text>
      <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SummarySectionProps {
  caloriesRemaining: number;
  proteinRemaining: number;
  waterRemainingMl: number;
  workoutMinutes: number;
  workoutGoalMinutes: number;
  dailyScore: DailyScoreData;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const SummarySection: React.FC<SummarySectionProps> = ({
  caloriesRemaining,
  proteinRemaining,
  waterRemainingMl,
  workoutMinutes,
  workoutGoalMinutes,
  dailyScore,
}) => {
  const workoutDone = workoutMinutes >= workoutGoalMinutes;

  return (
    <View style={styles.container}>
      {/* Scrollable pills row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsScroll}
      >
        <SummaryPill
          icon="🔥"
          label="Cal left"
          value={`${caloriesRemaining}`}
          accentColor={colors.companions.blaze.primary}
        />
        <SummaryPill
          icon="🥚"
          label="Protein"
          value={`${proteinRemaining}g`}
          accentColor={colors.companions.eggsy.primary}
        />
        <SummaryPill
          icon="💧"
          label="Water"
          value={waterRemainingMl >= 1000
            ? `${(waterRemainingMl / 1000).toFixed(1)}L`
            : `${waterRemainingMl}ml`}
          accentColor={colors.companions.droppy.primary}
        />
        <SummaryPill
          icon="🏋️"
          label={workoutDone ? 'Done!' : 'Workout'}
          value={workoutDone ? '✓' : `${workoutMinutes}/${workoutGoalMinutes}m`}
          accentColor={colors.companions.brocco.primary}
        />
      </ScrollView>

      {/* Daily Score card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreTitle}>Daily Score</Text>
          <Text style={styles.scoreDescription}>
            Based on calories, protein, hydration & workout
          </Text>
          <View style={[styles.tierBadge, { backgroundColor: dailyScore.color + '18' }]}>
            <Text style={[styles.tierText, { color: dailyScore.color }]}>
              {dailyScore.label}
            </Text>
          </View>
        </View>
        <ScoreDisplay
          score={dailyScore.score}
          color={dailyScore.color}
          label={dailyScore.tier === 'perfect' ? '🏆' : dailyScore.tier === 'great' ? '🌟' : '💪'}
        />
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  pillsScroll: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
    paddingRight: spacing.screenPadding + spacing.sm,
  },
  pill: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1.5,
    minWidth: 80,
    gap: 2,
  },
  pillIcon: {
    fontSize: 20,
  },
  pillValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  pillLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.lightMode.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  scoreCard: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.lightMode.surface,
    borderRadius: radius.card,
    padding: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  scoreInfo: {
    flex: 1,
    gap: 6,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.lightMode.text,
    letterSpacing: -0.3,
  },
  scoreDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.lightMode.textSecondary,
    lineHeight: 16,
    maxWidth: 160,
  },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  tierText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  scoreCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightMode.surface,
  },
  scoreNumber: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 30,
  },
  scoreSuffix: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.lightMode.textTertiary,
    lineHeight: 12,
  },
  scoreLabel: {
    fontSize: 14,
    lineHeight: 16,
  },
});
