// Animation constants
export const animations = {
  // Durations (in milliseconds)
  durations: {
    fast: 100,
    base: 200,
    normal: 300,
    slow: 500,
    slower: 700,
    slowest: 1000,
  },

  // Timing functions
  timings: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },

  // Spring configurations
  spring: {
    gentle: {
      damping: 10,
      mass: 1,
      stiffness: 100,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    },
    bouncy: {
      damping: 6,
      mass: 1,
      stiffness: 100,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    },
    stiff: {
      damping: 15,
      mass: 1,
      stiffness: 150,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    },
  },

  // Preset animations
  presets: {
    fadeIn: {
      duration: 300,
      timing: 'ease-in-out',
    },
    slideIn: {
      duration: 300,
      timing: 'ease-out',
    },
    slideUp: {
      duration: 300,
      timing: 'ease-out',
    },
    pop: {
      duration: 200,
      timing: 'ease-out',
    },
    bounce: {
      duration: 400,
      timing: 'ease-out',
    },
  },
} as const;
