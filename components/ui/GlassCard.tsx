import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { useCardLiftAnimation } from '../../hooks/useMotion';

export interface GlassCardProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark';
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  mode = 'light',
  glow = false,
  padding = 'md',
  onPress,
  style,
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

  const isLight = mode === 'light';

  const containerStyle: ViewStyle = {
    backgroundColor: isLight ? colors.glass.light : colors.glass.dark,
    borderColor: isLight ? colors.glass.borderLight : colors.glass.borderDark,
    borderWidth: 1.5,
    borderRadius: radius.card,
    padding: getPadding(),
    ...(glow ? shadows.mascotGlow : shadows.glass),
  };

  if (onPress) {
    return (
      <Animated.View
        style={[
          containerStyle,
          {
            transform: [{ scale }, { translateY }],
          },
          style,
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handleTouchStart}
          onPressOut={handleTouchEnd}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
};
