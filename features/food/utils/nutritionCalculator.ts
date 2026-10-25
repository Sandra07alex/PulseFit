/**
 * @file nutritionCalculator.ts
 * @description Pure utility functions for nutrition math.
 *
 * All calculations are proportional to serving size — the reference
 * nutrition values in FoodCatalogItem are per `servingSize` units.
 *
 * No side effects. Pure functions only. 100% testable.
 */

import type {
  FoodCatalogItem,
  FoodLogEntry,
  NutritionTotals,
  NutritionGoals,
  NutritionProgress,
  ServingUnit,
} from '../types/food.types';

// ---------------------------------------------------------------------------
// Unit conversion
// ---------------------------------------------------------------------------

/** Volume units in millilitres. Grams and pieces have no generic conversion. */
const ML_PER_UNIT: Partial<Record<ServingUnit, number>> = {
  ml:   1,
  tsp:  5,
  tbsp: 15,
  cup:  240,
};

/** Units a quantity of this food can be entered in (always includes the base unit) */
export function compatibleUnits(baseUnit: ServingUnit): ServingUnit[] {
  if (ML_PER_UNIT[baseUnit] === undefined) return [baseUnit];
  return Object.keys(ML_PER_UNIT) as ServingUnit[];
}

/** Convert a quantity between two compatible units; returns it unchanged otherwise */
export function convertQuantity(quantity: number, from: ServingUnit, to: ServingUnit): number {
  const a = ML_PER_UNIT[from];
  const b = ML_PER_UNIT[to];
  if (from === to || a === undefined || b === undefined) return quantity;
  return Math.round(((quantity * a) / b) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Core calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the actual nutritional values for a given quantity of food.
 *
 * @param food     - The catalog item with per-serving nutrition
 * @param quantity - Amount consumed
 * @param unit     - Unit of `quantity` (defaults to food.servingUnit)
 * @returns        - Scaled nutrition values
 */
export function calculateNutrition(
  food: FoodCatalogItem,
  quantity: number,
  unit: ServingUnit = food.servingUnit
): NutritionTotals {
  const ratio = convertQuantity(quantity, unit, food.servingUnit) / food.servingSize;
  return {
    calories: Math.round(food.calories * ratio),
    protein:  Math.round(food.protein  * ratio * 10) / 10,
    carbs:    Math.round(food.carbs    * ratio * 10) / 10,
    fat:      Math.round(food.fat      * ratio * 10) / 10,
    fiber:    Math.round(food.fiber    * ratio * 10) / 10,
  };
}

/**
 * Stand-in catalog item for a log with no catalog food (e.g. a quick log),
 * so editing its quantity scales the logged nutrition proportionally.
 */
export function foodFromLog(log: FoodLogEntry): FoodCatalogItem {
  return {
    id:          log.foodId,
    name:        log.foodName,
    category:    'Snacks',
    servingSize: log.quantity,
    servingUnit: log.servingUnit,
    calories:    log.calculatedCalories,
    protein:     log.calculatedProtein,
    carbs:       log.calculatedCarbs,
    fat:         log.calculatedFat,
    fiber:       log.calculatedFiber,
    sugar:       0,
    sodium:      0,
    isFavorite:  false,
    createdAt:   log.loggedAt,
    updatedAt:   log.loggedAt,
  };
}

/**
 * Calculate nutrition for a log entry using the catalog reference.
 * Recomputes from the original serving ratio for accuracy.
 */
export function recalculateLogEntry(
  log: FoodLogEntry,
  food: FoodCatalogItem
): Partial<FoodLogEntry> {
  const nutrition = calculateNutrition(food, log.quantity, log.servingUnit);
  return {
    calculatedCalories: nutrition.calories,
    calculatedProtein:  nutrition.protein,
    calculatedCarbs:    nutrition.carbs,
    calculatedFat:      nutrition.fat,
    calculatedFiber:    nutrition.fiber,
  };
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

/**
 * Sum nutrition totals across multiple log entries.
 */
export function sumNutritionFromLogs(logs: FoodLogEntry[]): NutritionTotals {
  return logs.reduce<NutritionTotals>(
    (acc, log) => ({
      calories: acc.calories + log.calculatedCalories,
      protein:  Math.round((acc.protein  + log.calculatedProtein)  * 10) / 10,
      carbs:    Math.round((acc.carbs    + log.calculatedCarbs)    * 10) / 10,
      fat:      Math.round((acc.fat      + log.calculatedFat)      * 10) / 10,
      fiber:    Math.round((acc.fiber    + log.calculatedFiber)    * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * Sum raw NutritionTotals objects.
 */
export function sumNutrition(items: NutritionTotals[]): NutritionTotals {
  return items.reduce<NutritionTotals>(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein:  Math.round((acc.protein + item.protein) * 10) / 10,
      carbs:    Math.round((acc.carbs   + item.carbs)   * 10) / 10,
      fat:      Math.round((acc.fat     + item.fat)     * 10) / 10,
      fiber:    Math.round((acc.fiber   + item.fiber)   * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

// ---------------------------------------------------------------------------
// Goal progress
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pct(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return clamp(Math.round((current / goal) * 100), 0, 100);
}

/**
 * Compute remaining nutrition vs. daily goals.
 * Never returns negative values — returns 0 if goal is exceeded.
 */
export function getRemainingNutrition(
  totals: NutritionTotals,
  goals: NutritionGoals
): NutritionTotals {
  return {
    calories: Math.max(0, goals.calories - totals.calories),
    protein:  Math.max(0, Math.round((goals.protein - totals.protein)  * 10) / 10),
    carbs:    Math.max(0, Math.round((goals.carbs   - totals.carbs)    * 10) / 10),
    fat:      Math.max(0, Math.round((goals.fat     - totals.fat)      * 10) / 10),
    fiber:    Math.max(0, Math.round((goals.fiber   - totals.fiber)    * 10) / 10),
  };
}

/**
 * Compute percentage progress toward each nutrition goal (0–100).
 */
export function getNutritionPercentages(
  totals: NutritionTotals,
  goals: NutritionGoals
): NutritionProgress['percentages'] {
  return {
    calories: pct(totals.calories, goals.calories),
    protein:  pct(totals.protein,  goals.protein),
    carbs:    pct(totals.carbs,    goals.carbs),
    fat:      pct(totals.fat,      goals.fat),
    fiber:    pct(totals.fiber,    goals.fiber),
  };
}

/**
 * Build a full NutritionProgress object from totals and goals.
 */
export function buildNutritionProgress(
  totals: NutritionTotals,
  goals: NutritionGoals
): NutritionProgress {
  return {
    totals,
    goals,
    remaining:   getRemainingNutrition(totals, goals),
    percentages: getNutritionPercentages(totals, goals),
  };
}

// ---------------------------------------------------------------------------
// Default goals helper
// ---------------------------------------------------------------------------

/** Derive macro goals from calorie goal using standard ratios */
export function deriveDefaultGoals(calorieGoal: number, proteinGoalGrams: number): NutritionGoals {
  // Protein from profile, Fat ~25%, Carbs fill the remaining calories
  // (same split as NutritionCalculator.calculateDailyMacros used at onboarding)
  const fatCal     = calorieGoal * 0.25;
  const carbsCal   = Math.max(0, calorieGoal - proteinGoalGrams * 4 - fatCal);
  return {
    calories: calorieGoal,
    protein:  proteinGoalGrams,
    carbs:    Math.round(carbsCal / 4),   // 4 kcal/g
    fat:      Math.round(fatCal  / 9),   // 9 kcal/g
    fiber:    30,                          // standard 30g/day recommendation
  };
}
