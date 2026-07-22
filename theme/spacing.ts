// Spacing scale constants
export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 56,
  '7xl': 64,
  '8xl': 72,

  // Aliases for common use cases
  none: 0,
  small: 8,
  medium: 16,
  large: 24,
  extraLarge: 32,
  huge: 48,

  // Container padding/margins
  containerPadding: 16,
  screenPadding: 20,

  // Component spacing
  componentGap: 12,
  buttonHeight: 48,
  iconSize: 24,
} as const;

export type Spacing = typeof spacing[keyof typeof spacing];
