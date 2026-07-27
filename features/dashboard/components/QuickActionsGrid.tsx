/**
 * @file QuickActionsGrid.tsx
 * @description 2×2 grid of large, gradient quick-action buttons.
 *
 * Actions:
 *  🍽 Add Food
 *  💧 Add Water
 *  🏋 Log Workout
 *  ⚖ Log Weight
 *
 * Each button uses usePressAnimation for a satisfying bounce.
 * Navigation routes are passed via onActionPress callback.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { usePressAnimation } from '../../../hooks/useMotion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import type { QuickAction } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Quick action definitions
// ---------------------------------------------------------------------------

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id:       'food',
    icon:     '🍽️',
    label:    'Add Food',
    gradient: [colors.companions.eggsy.primary, colors.companions.brocco.primary] as const,
    route:    '/(tabs)/nutrition',
  },
  {
    id:       'water',
    icon:     '💧',
    label:    'Add Water',
    gradient: [colors.companions.droppy.primary, colors.companions.droppy.light] as const,
    route:    '/(tabs)/nutrition',
  },
  {
    id:       'workout',
    icon:     '🏋️',
    label:    'Log Workout',
    gradient: [colors.companions.blaze.primary, '#FF8E53'] as const,
    route:    '/(tabs)/workout',
  },
  {
    id:       'weight',
    icon:     '⚖️',
    label:    'Log Weight',
    gradient: [colors.companions.luna.primary, colors.companions.pulse.primary] as const,
    route:    '/(tabs)/profile',
  },
];

// ---------------------------------------------------------------------------
// Single action button
// ---------------------------------------------------------------------------

interface ActionButtonProps {
  action: QuickAction;
  index: number;
  onPress: (id: QuickAction['id']) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ action, index, onPress }) => {
  const { scale, handlePressIn, handlePressOut } = usePressAnimation(0.93);

  // Staggered entrance
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = 200 + index * 70;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 130,
        friction: 14,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  const [primary, secondary] = action.gradient;

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(action.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.85}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={action.label}
      >
        {/* Colour background using primary gradient colour */}
        <View style={[styles.buttonBg, { backgroundColor: primary }]}>
          {/* Decorative circle */}
          <View style={[styles.decorCircle, { backgroundColor: secondary + '40' }]} />

          <Text style={styles.buttonIcon}>{action.icon}</Text>
          <Text style={styles.buttonLabel}>{action.label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

interface QuickActionsGridProps {
  onActionPress: (id: QuickAction['id']) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ onActionPress }) => (
  <View style={styles.container}>
    <View style={styles.grid}>
      {QUICK_ACTIONS.map((action, index) => (
        <ActionButton
          key={action.id}
          action={action}
          index={index}
          onPress={onActionPress}
        />
      ))}
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  buttonWrapper: {
    width: '47%',
  },
  button: {
    borderRadius: radius.card,
    overflow: 'hidden',
    ...shadows.md,
  },
  buttonBg: {
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'flex-start',
    minHeight: 100,
    overflow: 'hidden',
    gap: 10,
  },
  decorCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    right: -20,
    bottom: -20,
  },
  buttonIcon: {
    fontSize: 28,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
});
