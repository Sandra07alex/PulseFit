/**
 * @file DashboardEmptyState.tsx
 * @description Mascot-backed empty state variants for dashboard sections.
 * Used when no nutrition, water, workout, or weight data exists yet.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Companion } from '../../../components/mascot/Companion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EmptyStateVariant =
  | 'activity'   // No recent activity
  | 'meals'      // No meals logged
  | 'water'      // No water logged
  | 'workout'    // No workout logged
  | 'weight'     // No weight logged
  | 'generic';   // Generic first-time view

interface EmptyStateConfig {
  title: string;
  description: string;
  ctaLabel?: string;
  companionMood: 'idle' | 'celebrate' | 'sad' | 'wave';
}

// ---------------------------------------------------------------------------
// Copy per variant
// ---------------------------------------------------------------------------

const CONFIGS: Record<EmptyStateVariant, EmptyStateConfig> = {
  activity: {
    title: 'No Activity Yet Today',
    description:
      'Your journey begins today! Log a meal, drink some water, or start a workout.',
    ctaLabel: 'Log Something',
    companionMood: 'wave',
  },
  meals: {
    title: 'No Meals Logged Yet',
    description: "Let's start with breakfast! Even a quick snack counts. 🍳",
    ctaLabel: 'Add Food',
    companionMood: 'idle',
  },
  water: {
    title: 'Stay Hydrated!',
    description: "You haven't logged any water today. Your first sip starts your streak! 💧",
    ctaLabel: 'Log Water',
    companionMood: 'sad',
  },
  workout: {
    title: 'No Workout Yet',
    description: "Get moving! Even a 10-minute walk counts toward your goal. 🏃",
    ctaLabel: 'Start Workout',
    companionMood: 'idle',
  },
  weight: {
    title: 'Track Your Progress',
    description: 'Log your weight today to start monitoring your transformation journey.',
    ctaLabel: 'Log Weight',
    companionMood: 'celebrate',
  },
  generic: {
    title: 'Your Journey Begins Today! 🚀',
    description:
      '❤️ Pulse is here to guide you every step of the way. Start by logging your first entry!',
    ctaLabel: 'Get Started',
    companionMood: 'wave',
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DashboardEmptyStateProps {
  variant?: EmptyStateVariant;
  onCtaPress?: () => void;
  /** Show inline (card-like) vs full-page style */
  inline?: boolean;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  variant = 'activity',
  onCtaPress,
  inline = true,
}) => {
  const config = CONFIGS[variant];

  return (
    <View style={[styles.container, inline && styles.inlineContainer]}>
      {/* Pulse mascot */}
      <Companion
        id="pulse"
        mood={config.companionMood}
        size={inline ? 'md' : 'lg'}
        animated
      />

      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>

      {config.ctaLabel && onCtaPress && (
        <TouchableOpacity
          style={styles.cta}
          onPress={onCtaPress}
          activeOpacity={0.82}
          accessibilityRole="button"
          accessibilityLabel={config.ctaLabel}
        >
          <Text style={styles.ctaText}>{config.ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
    paddingHorizontal: spacing['3xl'],
    gap: spacing.md,
  },
  inlineContainer: {
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.lightMode.text,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.lightMode.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  cta: {
    marginTop: spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.2,
  },
});
