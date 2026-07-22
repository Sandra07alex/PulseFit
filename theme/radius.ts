// Border radius constants - PulseFit Design System

export const radius = {
  // Base scale
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  '3xl': 40,

  // Aliases
  none: 0,
  small: 8,
  medium: 14,
  large: 20,
  extraLarge: 28,
  rounded: 24,
  full: 999,

  // Signature component curves
  heroCard: 32,
  card: 24,
  cardSmall: 18,
  pill: 999,
  button: 16,
  buttonPill: 999,
  input: 16,
  avatar: 999,
  sheet: 32,
  modal: 28,
  badge: 10,
  chip: 999,
  toast: 20,
  navPill: 999,
} as const;

export type Radius = typeof radius[keyof typeof radius];
