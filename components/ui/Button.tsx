// Button component
import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, radius, colors } from '~/theme';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<Pressable, ButtonProps>(
  (
    {
      label,
      variant = 'primary',
      size = 'medium',
      disabled = false,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const styles = StyleSheet.create({
      base: {
        borderRadius: radius.button,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: spacing.buttonHeight,
        paddingHorizontal: spacing.lg,
      },
      small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
      medium: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
      large: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.secondary },
      outline: { backgroundColor: colors.transparent, borderWidth: 2, borderColor: colors.primary },
      ghost: { backgroundColor: 'transparent' },
      disabled: { opacity: 0.5 },
    });

    return (
      <Pressable
        ref={ref}
        disabled={disabled || loading}
        style={[
          styles.base,
          styles[size],
          styles[variant],
          disabled && styles.disabled,
        ]}
        {...props}
      >
        <Text variant="button">{loading ? 'Loading...' : label}</Text>
      </Pressable>
    );
  },
);

Button.displayName = 'Button';
