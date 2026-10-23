import React from 'react';
import { ViewStyle } from 'react-native';
import { ClayCard } from '../clay/ClayCard';
import { splitStyle, radiusOf } from '../clay/splitStyle';
import { radius } from '../../theme/radius';

export interface GlassCardProps {
  children: React.ReactNode;
  mode?: 'light' | 'dark';
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
  style?: ViewStyle;
}

const PADDING = { none: 0, sm: 12, md: 18, lg: 24 } as const;

/** GlassCard – kept for API compatibility, now a soft clay surface */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  mode = 'light',
  glow = false,
  padding = 'md',
  onPress,
  style,
}) => {
  const { outer, inner } = splitStyle(style);
  return (
    <ClayCard
      tint={mode === 'dark' ? 'pulse' : 'cloud'}
      depth="md"
      glow={glow ? 'strong' : 'medium'}
      radius={radiusOf(style, radius.card)}
      padding={PADDING[padding]}
      onPress={onPress}
      style={outer}
      contentStyle={inner}
    >
      {children}
    </ClayCard>
  );
};
