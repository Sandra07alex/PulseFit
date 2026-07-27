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
} from '../types/food.types';

// ---------------------------------------------------------------------------
// Core calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the actual nutritional values for a given quantity of food.
 *
 * @param food     - The catalog item with per-serving nutrition
 * @param quantity - Amount consumed (in the same unit as food.servingUnit)
 * @returns        - Scaled nutrition values
 */
export function calculateNutrition(
  food: FoodCatalogItem,
  quantity: number
): NutritionTotals {
  const ratio = quantity / food.servingSize;
  return {
    calories: Math.round(food.calories * ratio),
    protein:  Math.round(food.protein  * ratio * 10) / 10,
    carbs:    Math.round(food.carbs    * ratio * 10) / 10,
    fat:      Math.round(food.fat      * ratio * 10) / 10,
    fiber:    Math.round(food.fiber    * ratio * 10) / 10,
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
  const nutrition = calculateNutrition(food, log.quantity);
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
  // Standard split: Protein from profile, Carbs ~50%, Fat ~25%
  const carbsCal   = calorieGoal * 0.50;
  const fatCal     = calorieGoal * 0.25;
  return {
    calories: calorieGoal,
    protein:  proteinGoalGrams,
    carbs:    Math.round(carbsCal / 4),   // 4 kcal/g
    fat:      Math.round(fatCal  / 9),   // 9 kcal/g
    fiber:    30,                          // standard 30g/day recommendation
  };
}
