import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import { ClayButton } from '../clay/ClayButton';
import { splitStyle } from '../clay/splitStyle';
import { clayTints, ClayTint } from '../../theme/clay';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'floating' | 'outline' | 'ghost' | 'quickAction' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  accessibilityLabel?: string;
}

const VARIANT_TINT: Record<NonNullable<ButtonProps['variant']>, ClayTint> = {
  primary: 'pulse',
  floating: 'pulse',
  secondary: 'cloud',
  glass: 'cloud',
  outline: 'cloud',
  ghost: 'cloud',
  quickAction: 'cloud',
  danger: 'blaze',
};

/** Button – a puffy clay pill. Variants map onto clay tints. */
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
  const tint = VARIANT_TINT[variant];
  const { outer } = splitStyle(style);
  return (
    <ClayButton
      label={label}
      onPress={onPress}
      tint={tint}
      size={size}
      icon={icon}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      style={outer}
      labelStyle={[tint === 'cloud' && { color: clayTints.pulse.accent }, labelStyle]}
      accessibilityLabel={accessibilityLabel}
    />
  );
};
