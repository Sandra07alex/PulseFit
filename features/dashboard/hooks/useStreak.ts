/**
 * @file useStreak.ts
 * @description Reads the user's activity streak. The streak itself is written by
 * StreakService.recordActivity(), which every logging repository calls.
 * Reloads whenever the screen regains focus.
 */

import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { StreakService } from '../../../services/StreakService';
import type { StreakData } from '../types/dashboard.types';

const DEFAULT_STREAK: StreakData = {
  current: 0,
  longest: 0,
  weeklyActivity: [false, false, false, false, false, false, false],
};

export function useStreak() {
  const [data, setData] = useState<StreakData>(DEFAULT_STREAK);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { current, longest, weeklyActivity } = await StreakService.getStreak();
      setData({ current, longest, weeklyActivity });
    } catch (err) {
      console.warn('[useStreak] Failed to load streak:', err);
      setData(DEFAULT_STREAK);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { ...data, isLoading, refresh: load };
}
