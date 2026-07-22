// Storage Key Constants

export const StorageKeys = {
  THEME_MODE: '@pulsefit/theme_mode',
  USER_PROFILE: '@pulsefit/user_profile',
  AUTH_TOKEN: '@pulsefit/auth_token',
  SETTINGS: '@pulsefit/settings',
  WATER_LOGS: '@pulsefit/water_logs',
  WORKOUT_LOGS: '@pulsefit/workout_logs',
  NUTRITION_LOGS: '@pulsefit/nutrition_logs',
  COMPANION_STATE: '@pulsefit/companion_state',
  ACHIEVEMENTS: '@pulsefit/achievements',
  LAST_SYNC: '@pulsefit/last_sync',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];
