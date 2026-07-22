import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View, Animated, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { usePressAnimation } from '../../hooks/useMotion';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'floating' | 'outline' | 'ghost' | 'quickAction';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  labelStyle,
  accessibilityLabel,
}) => {
  const { scale, handlePressIn, handlePressOut } = usePressAnimation(0.95);

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          ...shadows.sm,
        };
      case 'glass':
        return {
          backgroundColor: colors.glass.light,
          borderWidth: 1,
          borderColor: colors.glass.borderLight,
          ...shadows.glass,
        };
      case 'floating':
        return {
          backgroundColor: colors.primary,
          borderRadius: radius.pill,
          ...shadows.button,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'quickAction':
        return {
          backgroundColor: colors.primarySoft,
          borderRadius: radius.pill,
        };
      case 'primary':
      default:
        return {
          backgroundColor: colors.primary,
          ...shadows.button,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.gray400;
    if (variant === 'glass' || variant === 'ghost' || variant === 'quickAction') return colors.primary;
    if (variant === 'outline') return colors.primary;
    return colors.white;
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16, minHeight: 38 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 28, minHeight: 56 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 22, minHeight: 48 };
    }
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale }] },
        fullWidth && { width: '100%' },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ disabled: disabled || loading }}
        style={[
          styles.base,
          getSizeStyle(),
          getVariantStyle(),
          disabled && styles.disabled,
          fullWidth && { width: '100%' },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={getTextColor()} />
        ) : (
          <View style={styles.contentRow}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={[styles.text, { color: getTextColor() }, labelStyle]}>
              {label}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.buttonPill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
});
