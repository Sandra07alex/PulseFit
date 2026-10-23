/**
 * @file useWorkouts.ts
 * @description Offline workout log state for the Move screen.
 * Reloads on focus so entries made elsewhere show up immediately.
 */

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { WorkoutRepository } from '../../../services/repositories/WorkoutRepository';
import { LocalProfileService } from '../../../services/LocalProfileService';
import { WorkoutCalculator } from '../../../services/WorkoutCalculator';
import { isOnLocalDay, lastNDayKeys, localDateKey } from '../../../utils/date';
import type { Workout, WorkoutIntensity } from '../../../types/models';

export interface NewWorkout {
  title: string;
  category: string;
  durationMinutes: number;
  intensity: WorkoutIntensity;
  notes?: string;
}

export interface UseWorkoutsReturn {
  today: Workout[];
  todayMinutes: number;
  todayCalories: number;
  /** Active minutes for the last 7 days, oldest first (last = today) */
  week: { day: string; minutes: number }[];
  weightKg: number;
  isLoading: boolean;
  estimateCalories: (w: Pick<NewWorkout, 'category' | 'durationMinutes' | 'intensity'>) => number;
  addWorkout: (w: NewWorkout) => Promise<Workout>;
  removeWorkout: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useWorkouts(): UseWorkoutsReturn {
  const [all, setAll] = useState<Workout[]>([]);
  const [weightKg, setWeightKg] = useState(70);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [items, profile] = await Promise.all([
        WorkoutRepository.getAll(),
        LocalProfileService.getProfile(),
      ]);
      setAll(items);
      setWeightKg(profile?.weightKg ?? 70);
    } catch (err) {
      console.error('[useWorkouts] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const estimateCalories = useCallback(
    (w: Pick<NewWorkout, 'category' | 'durationMinutes' | 'intensity'>) =>
      WorkoutCalculator.calculateCaloriesBurned(w.category, w.durationMinutes, weightKg, w.intensity),
    [weightKg]
  );

  const addWorkout = useCallback(
    async (w: NewWorkout) => {
      const created = await WorkoutRepository.create({
        userId: 'local',
        title: w.title,
        category: w.category,
        durationMinutes: w.durationMinutes,
        caloriesBurned: estimateCalories(w),
        intensity: w.intensity,
        notes: w.notes,
        completedAt: new Date().toISOString(),
      });
      setAll((prev) => [created, ...prev]);
      return created;
    },
    [estimateCalories]
  );

  const removeWorkout = useCallback(async (id: string) => {
    setAll((prev) => prev.filter((w) => w.id !== id));
    await WorkoutRepository.delete(id);
  }, []);

  const todayKey = localDateKey();
  const today = all
    .filter((w) => isOnLocalDay(w.completedAt, todayKey))
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));

  const week = lastNDayKeys(7).map((day) => ({
    day,
    minutes: all
      .filter((w) => isOnLocalDay(w.completedAt, day))
      .reduce((s, w) => s + w.durationMinutes, 0),
  }));

  return {
    today,
    todayMinutes: today.reduce((s, w) => s + w.durationMinutes, 0),
    todayCalories: today.reduce((s, w) => s + w.caloriesBurned, 0),
    week,
    weightKg,
    isLoading,
    estimateCalories,
    addWorkout,
    removeWorkout,
    refresh: load,
  };
}
