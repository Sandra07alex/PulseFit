/**
 * Strongly typed storage keys for PulseFit features.
 */
export const StorageKeys = {
  PROFILE: '@pulsefit/profile',
  FOOD_LOGS: '@pulsefit/food_logs',
  WATER_LOGS: '@pulsefit/water_logs',
  WORKOUT_LOGS: '@pulsefit/workout_logs',
  WEIGHT_LOGS: '@pulsefit/weight_logs',
  SETTINGS: '@pulsefit/settings',
  STREAK: '@pulsefit/streak',
  QUOTES: '@pulsefit/quotes',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
