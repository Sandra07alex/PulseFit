// Recommended Health & Activity Boundaries Constants

export const Limits = {
  WATER: {
    MIN_DAILY_ML: 1000,
    DEFAULT_DAILY_ML: 2500,
    MAX_DAILY_ML: 6000,
    QUICK_ADD_SMALL_ML: 250,
    QUICK_ADD_LARGE_ML: 500,
  },
  CALORIES: {
    MIN_DAILY_KCAL: 1200,
    DEFAULT_DAILY_KCAL: 2000,
    MAX_DAILY_KCAL: 5000,
  },
  PROTEIN: {
    DEFAULT_PER_KG_GRAMS: 1.6, // 1.6g per kg of bodyweight
  },
  STEPS: {
    DEFAULT_DAILY_TARGET: 10000,
    MAX_DAILY_TARGET: 50000,
  },
  WORKOUT: {
    MIN_DURATION_MINS: 5,
    MAX_DURATION_MINS: 300,
  },
} as const;
