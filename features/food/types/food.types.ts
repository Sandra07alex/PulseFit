/**
 * @file food.types.ts
 * @description Strongly-typed domain models for the PulseFit Food Tracking feature.
 *
 * Architecture:
 *  - FoodCatalogItem  — nutrition database entry (read-only reference data)
 *  - FoodLogEntry     — user consumption record (references a catalog item)
 *  - Logs NEVER duplicate nutrition fields — they reference the catalog.
 *
 * Supabase-ready: field names use snake_case-compatible conventions.
 */

// ---------------------------------------------------------------------------
// Enumerations
// ---------------------------------------------------------------------------

export type FoodCategory =
  | 'Breakfast'
  | 'Fruits'
  | 'Vegetables'
  | 'Protein'
  | 'Seafood'
  | 'Dairy'
  | 'Grains'
  | 'Indian Foods'
  | 'Kerala Foods'
  | 'Fast Food'
  | 'Snacks'
  | 'Beverages'
  | 'Desserts'
  | 'Nuts & Seeds'
  | 'Gym Foods';

export type ServingUnit =
  | 'g'
  | 'ml'
  | 'pieces'
  | 'cup'
  | 'tbsp'
  | 'tsp'
  | 'custom';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export const FOOD_CATEGORIES: FoodCategory[] = [
  'Breakfast',
  'Fruits',
  'Vegetables',
  'Protein',
  'Seafood',
  'Dairy',
  'Grains',
  'Indian Foods',
  'Kerala Foods',
  'Fast Food',
  'Snacks',
  'Beverages',
  'Desserts',
  'Nuts & Seeds',
  'Gym Foods',
];

export const SERVING_UNITS: { value: ServingUnit; label: string }[] = [
  { value: 'g',      label: 'grams (g)' },
  { value: 'ml',     label: 'millilitres (ml)' },
  { value: 'pieces', label: 'pieces' },
  { value: 'cup',    label: 'cup' },
  { value: 'tbsp',   label: 'tablespoon' },
  { value: 'tsp',    label: 'teaspoon' },
  { value: 'custom', label: 'custom' },
];

// ---------------------------------------------------------------------------
// Food Catalog Item
// ---------------------------------------------------------------------------

/**
 * A single entry in the food nutrition database.
 * Nutrition values are always per `servingSize` units.
 * Never duplicated into logs — logs reference by `id`.
 */
export interface FoodCatalogItem {
  /** Unique identifier (UUID) */
  id: string;
  /** Display name of the food */
  name: string;
  /** Taxonomy category */
  category: FoodCategory;
  /** Brand or source (optional) */
  brand?: string;
  /** Reference serving size number */
  servingSize: number;
  /** Unit for the serving size */
  servingUnit: ServingUnit;
  /** Calories per serving */
  calories: number;
  /** Protein in grams per serving */
  protein: number;
  /** Carbohydrates in grams per serving */
  carbs: number;
  /** Fat in grams per serving */
  fat: number;
  /** Dietary fiber in grams per serving */
  fiber: number;
  /** Sugar in grams per serving */
  sugar: number;
  /** Sodium in milligrams per serving */
  sodium: number;
  /** Whether the user has marked this as a favourite */
  isFavorite: boolean;
  /** ISO timestamp */
  createdAt: string;
  /** ISO timestamp */
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Food Log Entry
// ---------------------------------------------------------------------------

/**
 * Represents a single food consumption event logged by the user.
 * Nutrition fields are pre-calculated at log time for historical accuracy.
 */
export interface FoodLogEntry {
  /** Unique identifier (UUID) */
  id: string;
  /** References FoodCatalogItem.id */
  foodId: string;
  /** Cached food name for display (in case catalog changes) */
  foodName: string;
  /** Meal slot this belongs to */
  mealType: MealType;
  /** Quantity consumed (in the food's servingUnit) */
  quantity: number;
  /** Unit used for quantity */
  servingUnit: ServingUnit;
  /** Pre-calculated calories for this entry */
  calculatedCalories: number;
  /** Pre-calculated protein (g) */
  calculatedProtein: number;
  /** Pre-calculated carbs (g) */
  calculatedCarbs: number;
  /** Pre-calculated fat (g) */
  calculatedFat: number;
  /** Pre-calculated fiber (g) */
  calculatedFiber: number;
  /** ISO timestamp of when the food was logged */
  loggedAt: string;
  /** Optional user notes */
  notes?: string;
}

// ---------------------------------------------------------------------------
// Nutrition Totals
// ---------------------------------------------------------------------------

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface NutritionProgress {
  totals: NutritionTotals;
  goals: NutritionGoals;
  remaining: NutritionTotals;
  percentages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

// ---------------------------------------------------------------------------
// Meal Group (grouped log entries per meal)
// ---------------------------------------------------------------------------

export interface MealGroup {
  mealType: MealType;
  entries: FoodLogEntry[];
  totals: NutritionTotals;
}

// ---------------------------------------------------------------------------
// Daily Nutrition Aggregate
// ---------------------------------------------------------------------------

export interface DailyNutrition {
  date: string; // ISO date YYYY-MM-DD
  mealGroups: MealGroup[];
  overallTotals: NutritionTotals;
}

// ---------------------------------------------------------------------------
// Search result shape
// ---------------------------------------------------------------------------

export interface FoodSearchResult {
  item: FoodCatalogItem;
  /** Relevance score for ranking */
  score: number;
}

// ---------------------------------------------------------------------------
// Emoji mapping helpers
// ---------------------------------------------------------------------------

export const MEAL_EMOJI: Record<MealType, string> = {
  Breakfast: '🌅',
  Lunch:     '☀️',
  Dinner:    '🌙',
  Snacks:    '🍎',
};

export const MEAL_EMPTY_MESSAGE: Record<MealType, string> = {
  Breakfast: 'No breakfast logged yet.',
  Lunch:     'Fuel your afternoon.',
  Dinner:    'Finish your day strong.',
  Snacks:    'Healthy snacks count too.',
};

export const CATEGORY_EMOJI: Record<FoodCategory, string> = {
  'Breakfast':    '🌅',
  'Fruits':       '🍎',
  'Vegetables':   '🥦',
  'Protein':      '🥚',
  'Seafood':      '🐟',
  'Dairy':        '🥛',
  'Grains':       '🌾',
  'Indian Foods': '🍛',
  'Kerala Foods': '🥥',
  'Fast Food':    '🍔',
  'Snacks':       '🍿',
  'Beverages':    '☕',
  'Desserts':     '🍰',
  'Nuts & Seeds': '🥜',
  'Gym Foods':    '💪',
};
