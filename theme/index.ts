// Main theme configuration & Token Exports
import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { animations } from './animations';

export * from './colors';
export * from './spacing';
export * from './radius';
export * from './typography';
export * from './shadows';
export * from './animations';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} as const;

export type Theme = typeof theme;
export * from './clay';
