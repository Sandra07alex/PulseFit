// Workout constants
export const WORKOUT_TYPES = [
  'Cardio',
  'Strength',
  'Flexibility',
  'Sports',
  'Yoga',
  'Pilates',
  'HIIT',
  'Cycling',
  'Running',
  'Swimming',
] as const;

export const INTENSITY_LEVELS = ['light', 'moderate', 'high'] as const;

export const CALORIE_BURN_FACTORS = {
  light: 3,
  moderate: 5,
  high: 8,
} as const;
