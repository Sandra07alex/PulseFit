import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { usePressAnimation } from '../../../hooks/useMotion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';

export interface OnboardingActivityCardProps {
  title: string;
  description: string;
  icon: string;
  multiplierText: string;
  selected?: boolean;
  onSelect: () => void;
}

export const OnboardingActivityCard: React.FC<OnboardingActivityCardProps> = ({
  title,
  description,
  icon,
  multiplierText,
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
          selected ? styles.cardSelected : styles.cardDefault,
          selected && shadows.md,
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.titleGroup}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
          </View>
          <View style={[styles.badge, selected ? styles.badgeSelected : styles.badgeDefault]}>
            <Text style={[styles.badgeText, selected && styles.badgeTextSelected]}>
              {multiplierText}
            </Text>
          </View>
        </View>

        <Text style={styles.description}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 2,
  },
  cardDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.gray200,
  },
  cardSelected: {
    backgroundColor: colors.companions.blaze.soft,
    borderColor: colors.companions.blaze.primary,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
    fontWeight: '800',
    color: colors.gray900,
  },
  titleSelected: {
    color: colors.companions.blaze.primary,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  badgeDefault: {
    backgroundColor: colors.gray100,
  },
  badgeSelected: {
    backgroundColor: colors.companions.blaze.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gray600,
  },
  badgeTextSelected: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 18,
    fontWeight: '500',
  },
});
