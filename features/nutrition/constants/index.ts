// Nutrition constants
export const NUTRITION_CONSTANTS = {
  DEFAULT_CALORIE_GOAL: 2000,
  DEFAULT_PROTEIN_GOAL: 150,
  DEFAULT_CARB_GOAL: 200,
  DEFAULT_FAT_GOAL: 65,
  MACRO_RATIOS: {
    BALANCED: { protein: 30, carbs: 40, fat: 30 },
    HIGH_PROTEIN: { protein: 40, carbs: 35, fat: 25 },
    LOW_CARB: { protein: 35, carbs: 25, fat: 40 },
  },
} as const;

export const FOOD_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Beverage',
] as const;
