import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { usePressAnimation } from '../../hooks/useMotion';

export interface FloatingButtonProps {
  icon: string;
  onPress: () => void;
  color?: string;
  size?: number;
  accessibilityLabel?: string;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  onPress,
  color = colors.primary,
  size = 56,
  accessibilityLabel = 'Floating Action Button',
}) => {
  const { scale, handlePressIn, handlePressOut } = usePressAnimation(0.9);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, shadows.button]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
        ]}
      >
        <Text style={[styles.icon, { fontSize: size * 0.45 }]}>{icon}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#FFFFFF',
  },
});
