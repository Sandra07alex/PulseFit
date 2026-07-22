// Hydration constants
export const HYDRATION_CONSTANTS = {
  DEFAULT_DAILY_GOAL: 2000, // ml
  CUP_SIZE: 250, // ml
  WATER_UNITS: ['ml', 'l', 'oz'] as const,
  QUICK_ADD_OPTIONS: [250, 500, 750] as const,
  REMINDER_INTERVAL: 60, // minutes
} as const;

export const HYDRATION_TARGETS = {
  LOW: 1500,
  NORMAL: 2000,
  HIGH: 3000,
  ATHLETE: 4000,
} as const;
