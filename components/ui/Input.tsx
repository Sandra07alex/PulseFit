// Input component (TextInput)
import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { spacing, radius, colors, typography } from '~/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled';
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, variant = 'default', style, ...props }, ref) => {
    const styles = StyleSheet.create({
      container: {
        marginBottom: spacing.md,
      },
      label: {
        marginBottom: spacing.sm,
      },
      input: {
        borderRadius: radius.input,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.sizes.base,
        borderWidth: variant === 'default' ? 1 : 0,
        borderColor: error ? colors.error : colors.border,
        backgroundColor: variant === 'filled' ? colors.surface : colors.white,
      },
      error: {
        marginTop: spacing.xs,
      },
    });

    return (
      <View style={styles.container}>
        {label && (
          <Text variant="label" style={styles.label}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.gray400}
          editable={!props.editable === false}
          {...props}
        />
        {error && (
          <Text variant="caption" style={[styles.error, { color: colors.error }]}>
            {error}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
