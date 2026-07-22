import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated } from 'react-native';
import { CompanionProps, CompanionConfig } from './types';
import { CompanionVector } from './CompanionVector';
import { useBreathingAnimation, usePressAnimation } from '../../hooks/useMotion';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';

export const COMPANION_CONFIGS: Record<string, CompanionConfig> = {
  droppy: {
    id: 'droppy',
    name: 'Droppy',
    domain: 'Water & Hydration',
    primaryColor: colors.companions.droppy.primary,
    lightColor: colors.companions.droppy.light,
    softColor: colors.companions.droppy.soft,
    tagline: 'Stay hydrated & refreshed!',
    personality: 'Fluid, energetic & bubbly',
  },
  eggsy: {
    id: 'eggsy',
    name: 'Eggsy',
    domain: 'Protein & Muscle',
    primaryColor: colors.companions.eggsy.primary,
    lightColor: colors.companions.eggsy.light,
    softColor: colors.companions.eggsy.soft,
    tagline: 'Fuel your gains!',
    personality: 'Strong, cozy & cheerful',
  },
  brocco: {
    id: 'brocco',
    name: 'Brocco',
    domain: 'Nutrition & Greens',
    primaryColor: colors.companions.brocco.primary,
    lightColor: colors.companions.brocco.light,
    softColor: colors.companions.brocco.soft,
    tagline: 'Nourish your body right!',
    personality: 'Wise, fresh & bubbly',
  },
  blaze: {
    id: 'blaze',
    name: 'Blaze',
    domain: 'Workouts & Cardio',
    primaryColor: colors.companions.blaze.primary,
    lightColor: colors.companions.blaze.light,
    softColor: colors.companions.blaze.soft,
    tagline: 'Ignite your inner fire!',
    personality: 'Hyped, fierce & explosive',
  },
  luna: {
    id: 'luna',
    name: 'Luna',
    domain: 'Sleep & Recovery',
    primaryColor: colors.companions.luna.primary,
    lightColor: colors.companions.luna.light,
    softColor: colors.companions.luna.soft,
    tagline: 'Rest well to recover strong!',
    personality: 'Peaceful, calm & dreamy',
  },
  pulse: {
    id: 'pulse',
    name: 'Pulse',
    domain: 'Main Head Coach',
    primaryColor: colors.companions.pulse.primary,
    lightColor: colors.companions.pulse.light,
    softColor: colors.companions.pulse.soft,
    tagline: 'You got this, warrior!',
    personality: 'Motivating, energetic & empathetic',
  },
};

export const Companion: React.FC<CompanionProps> = ({
  id = 'pulse',
  mood = 'idle',
  size = 'md',
  animated = true,
  showBadge = false,
  badgeText,
  onPress,
  accessibilityLabel,
}) => {
  // Map size to numeric dimension
  const numericSize = typeof size === 'number'
    ? size
    : size === 'sm' ? 44
    : size === 'md' ? 64
    : size === 'lg' ? 96
    : 128; // 'xl'

  const breathingScale = useBreathingAnimation(animated && mood === 'idle');
  const { scale: pressScale, handlePressIn, handlePressOut } = usePressAnimation(0.92);

  const companionConfig = COMPANION_CONFIGS[id] || COMPANION_CONFIGS.pulse;

  const content = (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { scale: Animated.multiply(breathingScale, pressScale) },
          ],
        },
      ]}
    >
      <View style={[styles.vectorWrapper, shadows.mascotGlow]}>
        <CompanionVector id={id} mood={mood} size={numericSize} />
      </View>

      {showBadge && (
        <View style={[styles.badge, { backgroundColor: companionConfig.primaryColor }]}>
          <Text style={styles.badgeText}>{badgeText || companionConfig.name}</Text>
        </View>
      )}
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || `${companionConfig.name} mascot`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vectorWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
