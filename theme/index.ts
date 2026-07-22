// Main theme configuration
import { colors } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { animations } from './animations';

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} as const;

export type Theme = typeof theme;
