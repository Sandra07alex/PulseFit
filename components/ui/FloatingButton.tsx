// FloatingButton component
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, radius, colors, shadows } from '~/theme';

interface FloatingButtonProps {
  icon?: React.ReactNode;
  label?: string;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  label,
  onPress,
  position = 'bottom-right',
  color = colors.primary,
  size = 'medium',
}) => {
  const sizeMap = {
    small: 48,
    medium: 56,
    large: 64,
  };

  const sizeValue = sizeMap[size];

  const positionMap = {
    'bottom-right': { right: spacing.lg, bottom: spacing.lg },
    'bottom-center': { alignSelf: 'center', bottom: spacing.lg },
    'bottom-left': { left: spacing.lg, bottom: spacing.lg },
  };

  const styles = StyleSheet.create({
    button: {
      width: sizeValue,
      height: sizeValue,
      borderRadius: radius.full,
      backgroundColor: color,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.button,
      position: 'absolute',
      ...positionMap[position],
    },
  });

  return (
    <Pressable style={styles.button} onPress={onPress}>
      {icon || (label && <Text color={colors.white}>{label}</Text>)}
    </Pressable>
  );
};
