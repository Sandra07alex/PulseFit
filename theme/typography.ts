// Typography constants
export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    // Rounded "cute" display face (loaded in app/_layout.tsx)
    display: 'Fredoka_700Bold',
    displaySemibold: 'Fredoka_600SemiBold',
    displayMedium: 'Fredoka_500Medium',
  },

  // Font sizes
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Font weights
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Text variants
  variants: {
    h1: {
      size: 32,
      weight: 700,
      lineHeight: 1.2,
    },
    h2: {
      size: 28,
      weight: 700,
      lineHeight: 1.2,
    },
    h3: {
      size: 24,
      weight: 600,
      lineHeight: 1.3,
    },
    h4: {
      size: 20,
      weight: 600,
      lineHeight: 1.4,
    },
    h5: {
      size: 18,
      weight: 600,
      lineHeight: 1.4,
    },
    h6: {
      size: 16,
      weight: 600,
      lineHeight: 1.5,
    },
    bodyLarge: {
      size: 16,
      weight: 400,
      lineHeight: 1.5,
    },
    body: {
      size: 14,
      weight: 400,
      lineHeight: 1.5,
    },
    bodySmall: {
      size: 12,
      weight: 400,
      lineHeight: 1.4,
    },
    caption: {
      size: 10,
      weight: 400,
      lineHeight: 1.4,
    },
    label: {
      size: 12,
      weight: 500,
      lineHeight: 1.4,
    },
    button: {
      size: 16,
      weight: 600,
      lineHeight: 1.5,
    },
  },
} as const;
