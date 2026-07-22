// Animation Durations Constants

export const AnimationDurations = {
  INSTANT: 50,
  FAST: 150,
  NORMAL: 250,
  SLOW: 400,
  SLOWER: 700,
  SLOWEST: 1200,
  BREATHING_CYCLE: 2800,
  TOAST_AUTO_DISMISS: 3000,
  FLAME_FLICKER: 600,
} as const;

export type AnimationDurationKey = keyof typeof AnimationDurations;
