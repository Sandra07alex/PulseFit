import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { typography, colors } from '../../theme';

type TextVariant = keyof typeof typography.variants;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof typography.weights;
}

export const Text = React.forwardRef<RNText, TextProps>(
  ({ variant = 'body', color = colors.text, weight, style, children, ...props }, ref) => {
    const variantStyle = typography.variants[variant];

    const styles = StyleSheet.create({
      base: {
        fontSize: variantStyle.size,
        fontWeight: String(weight ? typography.weights[weight] : variantStyle.weight) as TextStyle['fontWeight'],
        lineHeight: variantStyle.lineHeight * variantStyle.size,
        color,
      },
    });

    return (
      <RNText
        ref={ref}
        style={[styles.base, style as TextStyle]}
        {...props}
      >
        {children}
      </RNText>
    );
  },
);

Text.displayName = 'Text';
