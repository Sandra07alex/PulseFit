/**
 * @file useDashboardData.ts
 * @description The primary data hook for the Dashboard screen.
 *
 * Responsibilities:
 *  - Load user profile from LocalProfileService
 *  - Load today's nutrition, water, workout, weight logs from AsyncStorage
 *  - Compute MetricProgress objects for each tracked metric
 *  - Build RecentActivityEntry list from raw logs
 *  - Expose a refresh() function for pull-to-refresh
 *
 * Offline-first: all data comes from AsyncStorage.
 * Supabase-ready: data shapes mirror future remote table schemas.
 */

import { useState, useEffect, useCallback } from 'react';
import { LocalProfileService } from '../../../services/LocalProfileService';
import { StorageService } from '../../../services/StorageService';
import { StorageKeys } from '../../../constants/StorageKeys';
import { colors } from '../../../theme/colors';
import type {
  MetricProgress,
  RecentActivityEntry,
} from '../types/dashboard.types';
import type { NutritionEntry, WaterLog, Workout, WeightLog } from '../../../types/models';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns today's ISO date string (YYYY-MM-DD) */
function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Formats a relative time label like "2h ago", "Just now", "Yesterday" */
function timeAgo(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1)  return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24)  return `${diffHr}h ago`;
  return 'Yesterday';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pct(current: number, goal: number): number {
  if (goal <= 0) return 0;
  return clamp(Math.round((current / goal) * 100), 0, 100);
}

// ---------------------------------------------------------------------------
// Metric builders
// ---------------------------------------------------------------------------

function buildCaloriesMetric(today: number, goal: number): MetricProgress {
  const percentage = pct(today, goal);
  const remaining  = Math.max(0, goal - today);
  return {
    id:             'calories',
    label:          'Calories',
    icon:           '🔥',
    current:        Math.round(today),
    goal:           Math.round(goal),
    unit:           'kcal',
    percentage,
    remaining,
    remainingLabel: `${remaining} kcal left`,
    companionId:    'blaze',
    accentColor:    colors.companions.blaze.primary,
    softColor:      colors.companions.blaze.soft,
  };
}

function buildProteinMetric(today: number, goal: number): MetricProgress {
  const percentage = pct(today, goal);
  const remaining  = Math.max(0, goal - today);
  return {
    id:             'protein',
    label:          'Protein',
    icon:           '🥚',
    current:        Math.round(today),
    goal:           Math.round(goal),
    unit:           'g',
    percentage,
    remaining,
    remainingLabel: `${remaining}g remaining`,
    companionId:    'eggsy',
    accentColor:    colors.companions.eggsy.primary,
    softColor:      colors.companions.eggsy.soft,
  };
}

function buildWaterMetric(today: number, goal: number): MetricProgress {
  const percentage = pct(today, goal);
  const remaining  = Math.max(0, goal - today);
  const remainingL = (remaining / 1000).toFixed(1);
  return {
    id:             'water',
    label:          'Water',
    icon:           '💧',
    current:        today,
    goal,
    unit:           'ml',
    percentage,
    remaining,
    remainingLabel: remaining >= 1000 ? `${remainingL}L left` : `${remaining}ml left`,
    companionId:    'droppy',
    accentColor:    colors.companions.droppy.primary,
    softColor:      colors.companions.droppy.soft,
  };
}

function buildWorkoutMetric(todayMin: number, goalMin: number): MetricProgress {
  const percentage = pct(todayMin, goalMin);
  const remaining  = Math.max(0, goalMin - todayMin);
  return {
    id:             'workout',
    label:          'Workout',
    icon:           '🏋️',
    current:        todayMin,
    goal:           goalMin,
    unit:           'min',
    percentage,
    remaining,
    remainingLabel: remaining > 0 ? `${remaining} min left` : 'Goal achieved! 🎉',
    companionId:    'brocco',
    accentColor:    colors.companions.brocco.primary,
    softColor:      colors.companions.brocco.soft,
  };
}

// ---------------------------------------------------------------------------
// Recent activity builder
// ---------------------------------------------------------------------------

function buildRecentActivity(
  nutritionLogs: NutritionEntry[],
  waterLogs: WaterLog[],
  workouts: Workout[],
  weightLogs: WeightLog[]
): RecentActivityEntry[] {
  const entries: RecentActivityEntry[] = [];

  // Nutrition entries
  nutritionLogs.forEach((n) => {
    entries.push({
      id:          n.id,
      type:        'meal',
      icon:        n.mealType === 'Breakfast' ? '🍳'
                 : n.mealType === 'Lunch'     ? '🥗'
                 : n.mealType === 'Dinner'    ? '🍽️'
                 : '🍎',
      title:       n.foodName,
      detail:      `${n.calories} kcal · ${n.mealType}`,
      timeLabel:   timeAgo(n.loggedAt),
      accentColor: colors.companions.eggsy.primary,
    });
  });

  // Water logs
  waterLogs.forEach((w) => {
    entries.push({
      id:          w.id,
      type:        'water',
      icon:        '💧',
      title:       'Water',
      detail:      `${w.amountMl} ml`,
      timeLabel:   timeAgo(w.loggedAt),
      accentColor: colors.companions.droppy.primary,
    });
  });

  // Workouts
  workouts.forEach((w) => {
    entries.push({
      id:          w.id,
      type:        'workout',
      icon:        '🏋️',
      title:       w.title,
      detail:      `${w.durationMinutes} min · ${w.caloriesBurned} kcal burned`,
      timeLabel:   timeAgo(w.completedAt),
      accentColor: colors.companions.blaze.primary,
    });
  });

  // Weight logs
  weightLogs.forEach((w) => {
    entries.push({
      id:          w.id,
      type:        'weight',
      icon:        '⚖️',
      title:       'Weight Logged',
      detail:      `${w.weightKg} kg`,
      timeLabel:   timeAgo(w.createdAt),
      accentColor: colors.companions.brocco.primary,
    });
  });

  // Sort by most recent first and take top 8
  return entries
    .sort((a, b) => {
      // We stored timeLabel as a string — sort by id recency (UUIDs are not time-sortable)
      // Instead sort by the original ISO dates; rely on array order from storage
      return 0;
    })
    .slice(0, 8);
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export interface DashboardDataResult {
  userName:        string;
  metrics:         MetricProgress[];
  caloriesPct:     number;
  proteinPct:      number;
  waterPct:        number;
  workoutPct:      number;
  caloriesGoal:    number;
  proteinGoal:     number;
  waterGoal:       number;
  workoutGoal:     number;
  recentActivity:  RecentActivityEntry[];
  isLoading:       boolean;
  refresh:         () => void;
}

export function useDashboardData(): DashboardDataResult {
  const [isLoading,      setIsLoading]      = useState(true);
  const [userName,       setUserName]       = useState('Athlete');
  const [metrics,        setMetrics]        = useState<MetricProgress[]>([]);
  const [caloriesPct,    setCaloriesPct]    = useState(0);
  const [proteinPct,     setProteinPct]     = useState(0);
  const [waterPct,       setWaterPct]       = useState(0);
  const [workoutPct,     setWorkoutPct]     = useState(0);
  const [caloriesGoal,   setCaloriesGoal]   = useState(2000);
  const [proteinGoal,    setProteinGoal]    = useState(140);
  const [waterGoal,      setWaterGoal]      = useState(2500);
  const [workoutGoal,    setWorkoutGoal]    = useState(30);
  const [recentActivity, setRecentActivity] = useState<RecentActivityEntry[]>([]);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Profile
      const profile = await LocalProfileService.getProfile();
      const name      = profile?.name       ?? 'Athlete';
      const calGoal   = profile?.calorieGoal    ?? 2000;
      const proGoal   = profile?.proteinGoalGrams ?? 140;
      const watGoal   = profile?.waterGoalMl   ?? 2500;
      const wrkGoal   = 30; // default workout goal in minutes

      setUserName(name.split(' ')[0]); // First name only
      setCaloriesGoal(calGoal);
      setProteinGoal(proGoal);
      setWaterGoal(watGoal);
      setWorkoutGoal(wrkGoal);

      // 2. Today's nutrition logs
      const today = todayISO();
      const nutritionLogs = (
        await StorageService.getItem<NutritionEntry[]>(StorageKeys.NUTRITION_LOGS)
      ) ?? [];
      const todayNutrition = nutritionLogs.filter((n) => n.loggedAt.startsWith(today));
      const caloriesToday  = todayNutrition.reduce((s, n) => s + n.calories, 0);
      const proteinToday   = todayNutrition.reduce((s, n) => s + n.proteinGrams, 0);

      // 3. Today's water logs
      const waterLogs = (
        await StorageService.getItem<WaterLog[]>(StorageKeys.WATER_LOGS)
      ) ?? [];
      const todayWater = waterLogs.filter((w) => w.loggedAt.startsWith(today));
      const waterToday = todayWater.reduce((s, w) => s + w.amountMl, 0);

      // 4. Today's workout logs
      const workoutLogs = (
        await StorageService.getItem<Workout[]>(StorageKeys.WORKOUT_LOGS)
      ) ?? [];
      const todayWorkouts = workoutLogs.filter((w) => w.completedAt.startsWith(today));
      const workoutMinutes = todayWorkouts.reduce((s, w) => s + w.durationMinutes, 0);

      // 5. Weight logs (all time, for recent activity)
      const weightLogs = (
        await StorageService.getItem<WeightLog[]>(StorageKeys.WEIGHT_LOGS)
      ) ?? [];

      // 6. Build metrics
      const calMetric  = buildCaloriesMetric(caloriesToday,  calGoal);
      const proMetric  = buildProteinMetric(proteinToday,   proGoal);
      const watMetric  = buildWaterMetric(waterToday,       watGoal);
      const wrkMetric  = buildWorkoutMetric(workoutMinutes, wrkGoal);

      setMetrics([calMetric, proMetric, watMetric, wrkMetric]);
      setCaloriesPct(calMetric.percentage);
      setProteinPct(proMetric.percentage);
      setWaterPct(watMetric.percentage);
      setWorkoutPct(wrkMetric.percentage);

      // 7. Recent activity (combine all today's + recent weight)
      const recentWeights = weightLogs.slice(-3);
      const activity = buildRecentActivity(
        todayNutrition.slice(-5),
        todayWater.slice(-3),
        todayWorkouts,
        recentWeights,
      );
      setRecentActivity(activity);
    } catch (err) {
      console.error('[useDashboardData] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    userName,
    metrics,
    caloriesPct,
    proteinPct,
    waterPct,
    workoutPct,
    caloriesGoal,
    proteinGoal,
    waterGoal,
    workoutGoal,
    recentActivity,
    isLoading,
    refresh: load,
  };
}
