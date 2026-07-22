// Navigation Route Constants

export const Routes = {
  // Auth Stack
  AUTH_WELCOME: 'auth/welcome',
  AUTH_LOGIN: 'auth/login',
  AUTH_SIGNUP: 'auth/signup',
  AUTH_FORGOT_PASSWORD: 'auth/forgot-password',

  // Main Tab Stack
  TAB_TODAY: 'today',
  TAB_ACTIVITY: 'activity',
  TAB_NUTRITION: 'nutrition',
  TAB_PROFILE: 'profile',

  // Feature Detail Routes
  WORKOUT_DETAIL: 'workout-detail',
  NUTRITION_DETAIL: 'nutrition-detail',
  HYDRATION_DETAIL: 'hydration-detail',
  ACHIEVEMENTS: 'achievements',
  SETTINGS: 'settings',
  ONBOARDING: 'onboarding',
} as const;

export type RouteKey = typeof Routes[keyof typeof Routes];
