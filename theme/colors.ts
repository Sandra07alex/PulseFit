// Color palette constants
export const colors = {
  // Primary colors
  primary: '#6B5DFF',
  primaryLight: '#8B7DFF',
  primaryDark: '#4B3DFF',

  // Secondary colors
  secondary: '#FF6B6B',
  secondaryLight: '#FF8B8B',
  secondaryDark: '#FF4B4B',

  // Accent colors
  accent: '#00D4FF',
  accentLight: '#33E0FF',
  accentDark: '#00B8D4',

  // Success
  success: '#00C853',
  successLight: '#26DE81',
  successDark: '#009624',

  // Warning
  warning: '#FFA500',
  warningLight: '#FFB833',
  warningDark: '#FF8C00',

  // Error
  error: '#FF3838',
  errorLight: '#FF5252',
  errorDark: '#E53935',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',

  // Grays
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',

  // Status colors
  online: '#00C853',
  offline: '#9CA3AF',
  idle: '#FFA500',

  // Gradient colors
  gradientStart: '#6B5DFF',
  gradientEnd: '#00D4FF',
} as const;

export type Color = typeof colors[keyof typeof colors];
