// Storage Key Constants

export const StorageKeys = {
  THEME_MODE: '@pulsefit/theme_mode',
  USER_PROFILE: '@pulsefit/user_profile',
  AUTH_TOKEN: '@pulsefit/auth_token',
  SETTINGS: '@pulsefit/settings',
  WATER_LOGS: '@pulsefit/water_logs',
  WORKOUT_LOGS: '@pulsefit/workout_logs',
  NUTRITION_LOGS: '@pulsefit/nutrition_logs',
  WEIGHT_LOGS: '@pulsefit/weight_logs',
  DAILY_SUMMARIES: '@pulsefit/daily_summaries',
  QUOTES: '@pulsefit/quotes',
  COMPANION_STATE: '@pulsefit/companion_state',
  ACHIEVEMENTS: '@pulsefit/achievements',
  LAST_SYNC: '@pulsefit/last_sync',
  // Food Tracking (Phase 11)
  FOOD_CATALOG: '@pulsefit/food_catalog',
  FOOD_LOGS: '@pulsefit/food_logs',
  FOOD_CATALOG_SEEDED: '@pulsefit/food_catalog_seeded',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
