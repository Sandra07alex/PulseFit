import { FoodLog } from '../../food/models';
import { WaterLog } from '../../water/models';
import { WorkoutLog } from '../../workout/models';
import { WeightLog } from '../../weight/models';
import { ActivityItem } from '../models';
import { calculateTotal } from '../../../utils/helpers';

/**
 * Calculates total calories for a given set of food logs.
 */
export function calculateTodayCalories(foodLogs: FoodLog[]): number {
  return Math.round(calculateTotal(foodLogs, 'calories'));
}

/**
 * Calculates total protein grams for a given set of food logs.
 */
export function calculateTodayProtein(foodLogs: FoodLog[]): number {
  return Math.round(calculateTotal(foodLogs, 'proteinGrams'));
}

/**
 * Calculates total water amount in ml for a given set of water logs.
 */
export function calculateTodayWater(waterLogs: WaterLog[]): number {
  return Math.round(calculateTotal(waterLogs, 'amountMl'));
}

/**
 * Calculates total workout minutes for a given set of workout logs.
 */
export function calculateWorkoutMinutes(workoutLogs: WorkoutLog[]): number {
  return Math.round(calculateTotal(workoutLogs, 'durationMinutes'));
}

/**
 * Calculates weight change between the latest and the earliest log in the series.
 * Returns positive for gain, negative for loss.
 */
export function calculateWeightChange(weightLogs: WeightLog[]): number {
  if (weightLogs.length < 2) {
    return 0;
  }
  const sorted = [...weightLogs].sort((a, b) => new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime());
  const earliest = sorted[0].weightKg;
  const latest = sorted[sorted.length - 1].weightKg;
  return parseFloat((latest - earliest).toFixed(2));
}

/**
 * Calculates a wellness score (0 to 100) based on target goal achievement.
 * 
 * Weights:
 * - Calories: 35%
 * - Protein: 25%
 * - Water: 25%
 * - Workout: 15%
 */
export function calculateDailyScore(
  caloriesToday: number, calorieGoal: number,
  proteinToday: number, proteinGoal: number,
  waterToday: number, waterGoal: number,
  workoutMinutesToday: number, workoutGoalMinutes: number
): number {
  const caloriesPct = calorieGoal > 0 ? (caloriesToday / calorieGoal) * 100 : 0;
  const proteinPct = proteinGoal > 0 ? (proteinToday / proteinGoal) * 100 : 0;
  const waterPct = waterGoal > 0 ? (waterToday / waterGoal) * 100 : 0;
  const workoutPct = workoutGoalMinutes > 0 ? (workoutMinutesToday / workoutGoalMinutes) * 100 : 0;

  const score =
    Math.min(caloriesPct, 100) * 0.35 +
    Math.min(proteinPct, 100)  * 0.25 +
    Math.min(waterPct, 100)    * 0.25 +
    Math.min(workoutPct, 100)  * 0.15;

  return Math.round(score);
}

/**
 * Combines logs of different types into a single chronologically sorted recent activity list.
 */
export function calculateRecentActivity(
  foodLogs: FoodLog[],
  waterLogs: WaterLog[],
  workoutLogs: WorkoutLog[],
  weightLogs: WeightLog[],
  limit: number = 8
): ActivityItem[] {
  const items: ActivityItem[] = [];

  foodLogs.forEach((log) => {
    items.push({
      id: log.id,
      type: 'food',
      title: log.name,
      detail: `${log.calories} kcal · ${log.mealType}`,
      timestamp: log.loggedAt,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    });
  });

  waterLogs.forEach((log) => {
    items.push({
      id: log.id,
      type: 'water',
      title: 'Water Logged',
      detail: `${log.amountMl} ml`,
      timestamp: log.loggedAt,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    });
  });

  workoutLogs.forEach((log) => {
    items.push({
      id: log.id,
      type: 'workout',
      title: log.title,
      detail: `${log.durationMinutes} min · ${log.caloriesBurned} kcal burned`,
      timestamp: log.completedAt,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    });
  });

  weightLogs.forEach((log) => {
    items.push({
      id: log.id,
      type: 'weight',
      title: 'Weight Logged',
      detail: `${log.weightKg} kg`,
      timestamp: log.loggedAt,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    });
  });

  // Sort descending by timestamp (most recent activity first)
  return items
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
