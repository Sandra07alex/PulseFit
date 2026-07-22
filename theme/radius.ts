// Border radius constants
export const radius = {
  // Small radius
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,

  // Aliases
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  extraLarge: 16,
  rounded: 20,
  full: 999,

  // Component-specific
  button: 12,
  card: 16,
  input: 10,
  avatar: 999,
  sheet: 24,
  badge: 8,
} as const;

export type Radius = typeof radius[keyof typeof radius];
