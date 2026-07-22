// Animation constants & Spring presets - PulseFit Motion System

export const animations = {
  // Durations (in ms)
  durations: {
    instant: 50,
    fast: 150,
    base: 250,
    normal: 350,
    slow: 500,
    slower: 750,
    slowest: 1200,
    breathing: 2800,
    flameFlicker: 600,
  },

  // Timing functions
  timings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    customSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

  // Spring physics configurations
  spring: {
    // Gentle & smooth (for cards and sheets)
    gentle: {
      damping: 15,
      mass: 1,
      stiffness: 120,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    // Bouncy & energetic (for mascot reactions, celebratory pops, quick actions)
    bouncy: {
      damping: 8,
      mass: 0.8,
      stiffness: 140,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    // Snappy (for button presses and tab switches)
    snappy: {
      damping: 18,
      mass: 0.6,
      stiffness: 220,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    // Floating island tab bounce
    islandTab: {
      damping: 14,
      mass: 0.7,
      stiffness: 180,
      overshootClamping: false,
    },
    // Elastic pop (for quick action radial expansion)
    elastic: {
      damping: 10,
      mass: 0.9,
      stiffness: 160,
      overshootClamping: false,
    },
  },

  // Micro-interaction presets
  micro: {
    buttonPressScale: 0.94,
    cardTouchScale: 0.98,
    cardLiftTranslateY: -6,
    mascotBreathingScaleMax: 1.05,
    mascotBreathingScaleMin: 0.97,
    radialMenuDistance: 76,
  },
} as const;

export type AnimationSystem = typeof animations;
