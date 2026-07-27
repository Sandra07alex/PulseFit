/**
 * @file StreakCard.tsx
 * @description Activity streak card featuring:
 *  - Current streak counter
 *  - Longest streak
 *  - Weekly consistency dots (7-day row)
 *  - Breathing flame animation
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { useBreathingAnimation } from '../../../hooks/useMotion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import type { StreakData } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Day labels
// ---------------------------------------------------------------------------

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// ---------------------------------------------------------------------------
// Weekly dots row
// ---------------------------------------------------------------------------

const WeeklyDots: React.FC<{ activity: boolean[] }> = ({ activity }) => {
  const todayIndex = new Date().getDay(); // 0 = Sunday

  return (
    <View style={styles.dotsRow}>
      {DAY_LABELS.map((day, i) => {
        const isToday   = i === todayIndex;
        const isActive  = activity[i] ?? false;

        return (
          <View key={i} style={styles.dotColumn}>
            <View
              style={[
                styles.dot,
                isActive  && styles.dotActive,
                isToday   && styles.dotToday,
                isActive && isToday && styles.dotActiveToday,
              ]}
            >
              {isActive && <Text style={styles.dotCheck}>✓</Text>}
            </View>
            <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day}</Text>
          </View>
        );
      })}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface StreakCardProps {
  data: StreakData;
}

export const StreakCard: React.FC<StreakCardProps> = ({ data }) => {
  const flameScale = useBreathingAnimation(true);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Animated.Text style={[styles.flameIcon, { transform: [{ scale: flameScale }] }]}>
          🔥
        </Animated.Text>
        <Text style={styles.cardTitle}>Activity Streak</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {/* Current streak */}
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{data.current}</Text>
          <Text style={styles.statLabel}>Current{'\n'}Streak</Text>
        </View>

        {/* Vertical divider */}
        <View style={styles.divider} />

        {/* Longest streak */}
        <View style={styles.statBlock}>
          <Text style={[styles.statValue, { color: colors.companions.eggsy.primary }]}>
            {data.longest}
          </Text>
          <Text style={styles.statLabel}>Longest{'\n'}Streak</Text>
        </View>

        {/* Vertical divider */}
        <View style={styles.divider} />

        {/* Active days this week */}
        <View style={styles.statBlock}>
          <Text style={[styles.statValue, { color: colors.companions.brocco.primary }]}>
            {data.weeklyActivity.filter(Boolean).length}
          </Text>
          <Text style={styles.statLabel}>Days This{'\n'}Week</Text>
        </View>
      </View>

      {/* Weekly consistency */}
      <WeeklyDots activity={data.weeklyActivity} />

      {/* Motivational sub-text */}
      {data.current === 0 ? (
        <Text style={styles.motivationalText}>
          Log something today to start your streak! 💪
        </Text>
      ) : data.current === 1 ? (
        <Text style={styles.motivationalText}>
          Day 1 in the books — keep it going! 🎯
        </Text>
      ) : (
        <Text style={styles.motivationalText}>
          You're on fire! {data.current} days and counting 🔥
        </Text>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.lightMode.surface,
    borderRadius: radius.card,
    padding: spacing['2xl'],
    gap: spacing.xl,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flameIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.lightMode.text,
    letterSpacing: -0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBlock: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.companions.blaze.primary,
    letterSpacing: -1,
    lineHeight: 36,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.lightMode.textSecondary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    lineHeight: 15,
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: colors.gray100,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  dotColumn: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  dotActive: {
    backgroundColor: colors.companions.blaze.primary,
    borderColor: colors.companions.blaze.primary,
  },
  dotToday: {
    borderColor: colors.primary,
    borderWidth: 2.5,
  },
  dotActiveToday: {
    borderColor: colors.companions.blaze.primary,
  },
  dotCheck: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '800',
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.lightMode.textTertiary,
    textTransform: 'uppercase',
  },
  dayLabelToday: {
    color: colors.primary,
  },
  motivationalText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.lightMode.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    paddingTop: 4,
  },
});
