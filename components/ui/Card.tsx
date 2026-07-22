import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { useCardLiftAnimation } from '../../hooks/useMotion';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'soft' | 'outlined' | 'hero';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  style,
  accessibilityLabel,
}) => {
  const { scale, translateY, handleTouchStart, handleTouchEnd } = useCardLiftAnimation();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return 12;
      case 'lg':
        return 24;
      case 'md':
      default:
        return 18;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'hero':
        return {
          backgroundColor: colors.surface,
          borderRadius: radius.heroCard,
          borderWidth: 1,
          borderColor: colors.gray200,
          ...shadows.xl,
        };
      case 'elevated':
        return {
          backgroundColor: colors.surface,
          borderRadius: radius.card,
          ...shadows.cardLift,
        };
      case 'soft':
        return {
          backgroundColor: colors.gray50,
          borderRadius: radius.card,
        };
      case 'outlined':
        return {
          backgroundColor: colors.surface,
          borderRadius: radius.card,
          borderWidth: 1.5,
          borderColor: colors.gray200,
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.surface,
          borderRadius: radius.card,
          ...shadows.card,
        };
    }
  };

  const cardContent = (
    <View style={[styles.innerContainer, { padding: getPadding() }]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View
        style={[
          getVariantStyle(),
          {
            transform: [{ scale }, { translateY }],
          },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onPress}
          onPressIn={handleTouchStart}
          onPressOut={handleTouchEnd}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
        >
          {cardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={[getVariantStyle(), style]}>
      {cardContent}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    overflow: 'hidden',
  },
});
