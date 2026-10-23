import React from 'react';
import { ViewStyle } from 'react-native';
import { ClayCard } from '../clay/ClayCard';
import { splitStyle, radiusOf } from '../clay/splitStyle';
import { radius } from '../../theme/radius';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'soft' | 'outlined' | 'hero';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const PADDING = { none: 0, sm: 12, md: 18, lg: 24 } as const;

/** Card – rendered as a clay 3D surface */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  onPress,
  style,
  accessibilityLabel,
}) => {
  const { outer, inner } = splitStyle(style);
  const isHero = variant === 'hero';
  return (
    <ClayCard
      tint="cloud"
      depth={variant === 'soft' || variant === 'outlined' ? 'sm' : isHero ? 'lg' : 'md'}
      glow={variant === 'soft' ? 'none' : isHero || variant === 'elevated' ? 'strong' : 'medium'}
      radius={radiusOf(style, isHero ? radius.heroCard : radius.card)}
      padding={PADDING[padding]}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={outer}
      contentStyle={inner}
    >
      {children}
    </ClayCard>
  );
};
