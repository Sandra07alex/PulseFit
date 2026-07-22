// Card component
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { spacing, radius, shadows, colors } from '~/theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'filled' | 'outlined';
  pressable?: boolean;
  onPress?: () => void;
}

export const Card = React.forwardRef<View, CardProps>(
  ({ children, variant = 'elevated', pressable = false, onPress, style, ...props }, ref) => {
    const styles = StyleSheet.create({
      base: {
        borderRadius: radius.card,
        padding: spacing.md,
        backgroundColor: colors.white,
      },
      elevated: shadows.card,
      filled: { backgroundColor: colors.surface },
      outlined: { borderWidth: 1, borderColor: colors.border },
    });

    return (
      <View
        ref={ref}
        style={[styles.base, styles[variant], style]}
        {...props}
      >
        {children}
      </View>
    );
  },
);

Card.displayName = 'Card';
