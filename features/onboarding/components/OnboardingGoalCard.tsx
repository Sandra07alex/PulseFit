import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { usePressAnimation } from '../../../hooks/useMotion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';

export interface OnboardingGoalCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor?: string;
  selected?: boolean;
  onSelect: () => void;
}

export const OnboardingGoalCard: React.FC<OnboardingGoalCardProps> = ({
  title,
  subtitle,
  icon,
  accentColor = colors.primary,
  selected = false,
  onSelect,
}) => {
  const { scale, handlePressIn, handlePressOut } = usePressAnimation(0.96);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, styles.wrapper]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onSelect}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          selected ? { borderColor: accentColor, backgroundColor: accentColor + '08' } : styles.cardDefault,
          selected && shadows.md,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: accentColor + '18' }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={styles.textGroup}>
          <Text style={[styles.title, selected && { color: accentColor }]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={[styles.radioOuter, selected && { borderColor: accentColor }]}>
          {selected && <View style={[styles.radioInner, { backgroundColor: accentColor }]} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 2,
    gap: 14,
  },
  cardDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.gray200,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  textGroup: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
    fontWeight: '500',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
});
