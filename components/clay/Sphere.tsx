import React, { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';
import { shade } from '../../utils/color';

export interface SphereProps {
  size: number;
  color: string;
  opacity?: number;
}

/** Glossy 3D ball – used for decorations (streak dots, jar bubbles) */
export const Sphere: React.FC<SphereProps> = ({ size, color, opacity = 1 }) => {
  const id = `sph${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" opacity={opacity}>
      <Defs>
        <RadialGradient id={id} cx="38%" cy="32%" r="70%">
          <Stop offset="0%" stopColor={shade(color, 0.6)} />
          <Stop offset="55%" stopColor={color} />
          <Stop offset="100%" stopColor={shade(color, -0.22)} />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="48" fill={`url(#${id})`} />
      <Ellipse cx="36" cy="28" rx="15" ry="9" fill="#FFFFFF" opacity={0.65} />
      <Circle cx="62" cy="22" r="3" fill="#FFFFFF" opacity={0.5} />
    </Svg>
  );
};
