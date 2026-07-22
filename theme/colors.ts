// PulseFit Color Palette & Design Tokens

export const colors = {
  // Primary brand colors
  primary: '#6B5DFF',
  primaryLight: '#8B7DFF',
  primaryDark: '#4B3DFF',
  primarySoft: '#F0EEFF',

  // Secondary brand colors
  secondary: '#FF6B81',
  secondaryLight: '#FF8B9E',
  secondaryDark: '#FF4B65',
  secondarySoft: '#FFF0F2',

  // Accent colors
  accent: '#00D4FF',
  accentLight: '#33E0FF',
  accentDark: '#00B8D4',
  accentSoft: '#E6FAFF',

  // Mascot Companion identity colors
  companions: {
    droppy: {
      primary: '#00B4D8',
      light: '#90E0EF',
      soft: '#E0F7FA',
      gradient: ['#00B4D8', '#48CAE4'] as const,
    },
    eggsy: {
      primary: '#FFB703',
      light: '#FFE066',
      soft: '#FFF9E6',
      gradient: ['#FFB703', '#FB8500'] as const,
    },
    brocco: {
      primary: '#2A9D8F',
      light: '#52B788',
      soft: '#E8F5E9',
      gradient: ['#2A9D8F', '#74C69D'] as const,
    },
    blaze: {
      primary: '#FF4D4D',
      light: '#FF7676',
      soft: '#FFEBEE',
      gradient: ['#FF4D4D', '#FF8E53'] as const,
    },
    luna: {
      primary: '#7209B7',
      light: '#B5179E',
      soft: '#F3E5F5',
      gradient: ['#7209B7', '#480CA8'] as const,
    },
    pulse: {
      primary: '#6B5DFF',
      light: '#8B7DFF',
      soft: '#F0EEFF',
      gradient: ['#6B5DFF', '#00D4FF'] as const,
    },
  },

  // Glassmorphism & Translucency
  glass: {
    light: 'rgba(255, 255, 255, 0.75)',
    lightStrong: 'rgba(255, 255, 255, 0.90)',
    lightSoft: 'rgba(255, 255, 255, 0.50)',
    dark: 'rgba(26, 26, 36, 0.75)',
    darkStrong: 'rgba(26, 26, 36, 0.90)',
    borderLight: 'rgba(255, 255, 255, 0.35)',
    borderDark: 'rgba(255, 255, 255, 0.12)',
    glow: 'rgba(107, 93, 255, 0.15)',
  },

  // Gradients
  gradients: {
    primary: ['#6B5DFF', '#8B7DFF'] as const,
    vibrant: ['#6B5DFF', '#00D4FF'] as const,
    sunset: ['#FF6B81', '#FF8E53'] as const,
    emerald: ['#2A9D8F', '#52B788'] as const,
    sunburst: ['#FFB703', '#FB8500'] as const,
    deepSpace: ['#1E1B4B', '#312E81'] as const,
    cardGlow: ['rgba(107, 93, 255, 0.08)', 'rgba(0, 212, 255, 0.02)'] as const,
  },

  // Status & Feedback
  success: '#00C853',
  successLight: '#26DE81',
  successDark: '#009624',
  successSoft: '#E8F8F0',

  warning: '#FFA500',
  warningLight: '#FFB833',
  warningDark: '#FF8C00',
  warningSoft: '#FFF8E7',

  error: '#FF3838',
  errorLight: '#FF5252',
  errorDark: '#E53935',
  errorSoft: '#FFEEEE',

  // Neutrals
  white: '#FFFFFF',
  black: '#000000',

  // Grays / Dark scale
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

  // Light Mode Semantics
  lightMode: {
    background: '#F6F7FA',
    surface: '#FFFFFF',
    surfaceSubtle: '#F0F2F5',
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    border: '#E5E7EB',
    cardBackground: '#FFFFFF',
    navBackground: 'rgba(255, 255, 255, 0.88)',
  },

  // Dark Mode Semantics
  darkMode: {
    background: '#0D0E15',
    surface: '#161824',
    surfaceSubtle: '#1E2132',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    border: '#2A2D3F',
    cardBackground: '#161824',
    navBackground: 'rgba(22, 24, 36, 0.88)',
  },

  // Backward compatibility semantic mappings
  background: '#F6F7FA',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#E5E7EB',
  online: '#00C853',
  offline: '#9CA3AF',
  idle: '#FFA500',
  gradientStart: '#6B5DFF',
  gradientEnd: '#00D4FF',
} as const;

export type Color = typeof colors[keyof typeof colors];
