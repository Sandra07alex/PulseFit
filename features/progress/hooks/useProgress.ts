/**
 * @file useProgress.ts
 * @description Aggregates weight history, 7-day totals, streak and badges for the Stats tab.
 */

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { StorageService } from '../../../services/StorageService';
import { StorageKeys } from '../../../constants/StorageKeys';
import { LocalProfileService } from '../../../services/LocalProfileService';
import { StreakService } from '../../../services/StreakService';
import { WeightRepository } from '../../../services/repositories/WeightRepository';
import { isOnLocalDay, lastNDayKeys, localDateKey } from '../../../utils/date';
import { WORKOUT_GOAL_MINUTES } from '../../workouts/constants';
import type { NutritionEntry, UserProfile, WaterLog, WeightLog, Workout } from '../../../types/models';
import type { Badge, DayTotals } from '../types';

function buildBadges(args: {
  streak: number;
  longest: number;
  activeDays: number;
  week: DayTotals[];
  weights: WeightLog[];
  allWorkouts: Workout[];
  profile: UserProfile | null;
}): Badge[] {
  const { longest, activeDays, week, weights, allWorkouts, profile } = args;
  const waterGoal = profile?.waterGoalMl ?? 2500;
  const proteinGoal = profile?.proteinGoalGrams ?? 140;
  const weekMinutes = week.reduce((s, d) => s + d.workoutMinutes, 0);
  const lost =
    weights.length >= 2 ? weights[0].weightKg - weights[weights.length - 1].weightKg : 0;

  return [
    { id: 'first', emoji: '🌱', title: 'First Step', hint: 'Log anything', tint: 'brocco', unlocked: activeDays >= 1 },
    { id: 'streak3', emoji: '🔥', title: 'On Fire', hint: '3-day streak', tint: 'blaze', unlocked: longest >= 3 },
    { id: 'streak7', emoji: '👑', title: 'Week Royalty', hint: '7-day streak', tint: 'eggsy', unlocked: longest >= 7 },
    {
      id: 'hydro',
      emoji: '💧',
      title: 'Hydro Hero',
      hint: 'Hit your water goal',
      tint: 'droppy',
      unlocked: week.some((d) => d.waterMl >= waterGoal),
    },
    {
      id: 'protein',
      emoji: '🥚',
      title: 'Protein Pro',
      hint: 'Hit your protein goal',
      tint: 'eggsy',
      unlocked: week.some((d) => d.protein >= proteinGoal),
    },
    {
      id: 'mover',
      emoji: '🏃',
      title: 'Mover',
      hint: `${WORKOUT_GOAL_MINUTES * 5} min in a week`,
      tint: 'blaze',
      unlocked: weekMinutes >= WORKOUT_GOAL_MINUTES * 5,
    },
    { id: 'ten', emoji: '💪', title: 'Ten Strong', hint: '10 workouts', tint: 'pulse', unlocked: allWorkouts.length >= 10 },
    { id: 'scale', emoji: '⚖️', title: 'Tracker', hint: 'Log weight 5×', tint: 'luna', unlocked: weights.length >= 5 },
    { id: 'down', emoji: '🎯', title: 'Progress!', hint: 'Lose 1 kg', tint: 'bubblegum', unlocked: lost >= 1 },
  ];
}

export function useProgress() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [week, setWeek] = useState<DayTotals[]>([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0, weeklyActivity: Array(7).fill(false) as boolean[] });
  const [badges, setBadges] = useState<Badge[]>([]);

  const load = useCallback(async () => {
    try {
      const [p, weightLogs, nutrition, water, workouts, s] = await Promise.all([
        LocalProfileService.getProfile(),
        WeightRepository.getAll(),
        StorageService.getItem<NutritionEntry[]>(StorageKeys.NUTRITION_LOGS),
        StorageService.getItem<WaterLog[]>(StorageKeys.WATER_LOGS),
        StorageService.getItem<Workout[]>(StorageKeys.WORKOUT_LOGS),
        StreakService.getStreak(),
      ]);

      // oldest → newest, by day then creation time
      const sortedWeights = [...weightLogs].sort((a, b) =>
        a.date === b.date ? a.createdAt.localeCompare(b.createdAt) : a.date.localeCompare(b.date)
      );

      const days = lastNDayKeys(7).map<DayTotals>((day) => {
        const n = (nutrition ?? []).filter((e) => isOnLocalDay(e.loggedAt, day));
        return {
          day,
          calories: Math.round(n.reduce((sum, e) => sum + e.calories, 0)),
          protein: Math.round(n.reduce((sum, e) => sum + e.proteinGrams, 0)),
          waterMl: (water ?? []).filter((w) => isOnLocalDay(w.loggedAt, day)).reduce((sum, w) => sum + w.amountMl, 0),
          workoutMinutes: (workouts ?? [])
            .filter((w) => isOnLocalDay(w.completedAt, day))
            .reduce((sum, w) => sum + w.durationMinutes, 0),
        };
      });

      setProfile(p);
      setWeights(sortedWeights);
      setWeek(days);
      setStreak({ current: s.current, longest: s.longest, weeklyActivity: s.weeklyActivity });
      setBadges(
        buildBadges({
          streak: s.current,
          longest: s.longest,
          activeDays: s.activeDays.length,
          week: days,
          weights: sortedWeights,
          allWorkouts: workouts ?? [],
          profile: p,
        })
      );
    } catch (err) {
      console.error('[useProgress] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  /** Log today's weight (replacing an earlier entry from today) and sync the profile */
  const logWeight = useCallback(
    async (weightKg: number) => {
      const todayKey = localDateKey();
      const existing = await WeightRepository.getByDate(todayKey);
      await Promise.all(existing.map((w) => WeightRepository.delete(w.id)));
      await WeightRepository.create({ weightKg, date: todayKey });
      await LocalProfileService.updateProfile({ weightKg });
      await load();
    },
    [load]
  );

  const latest = weights[weights.length - 1]?.weightKg ?? profile?.weightKg ?? 70;
  const start = weights[0]?.weightKg ?? latest;

  return {
    isLoading,
    profile,
    weights,
    week,
    streak,
    badges,
    currentWeight: latest,
    startWeight: start,
    targetWeight: profile?.targetWeightKg ?? latest,
    logWeight,
    refresh: load,
  };
}
