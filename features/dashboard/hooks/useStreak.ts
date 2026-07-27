/**
 * @file useStreak.ts
 * @description Reads and maintains the user's activity streak from AsyncStorage.
 * Automatically updates the streak on mount based on today's activity.
 * Future-ready: streak record shape matches Supabase column conventions.
 */

import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../../../services/StorageService';
import type { StreakData, StreakRecord } from '../types/dashboard.types';

const DEFAULT_STREAK: StreakData = {
  current: 0,
  longest: 0,
  weeklyActivity: [false, false, false, false, false, false, false],
};

/** Returns yesterday's ISO date string */
function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/** Returns a 7-element boolean array [Sun, Mon, Tue, Wed, Thu, Fri, Sat] */
function buildWeeklyActivity(record: StreakRecord | null): boolean[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    // i=0 is Sunday. Map each day of this week relative to today.
    const diff = today.getDay() - i;
    const d = new Date(today);
    d.setDate(today.getDate() - diff);
    const iso = d.toISOString().split('T')[0];
    if (!record) return false;
    // Mark active if it's within the streak window ending on lastActiveDate
    if (record.lastActiveDate < iso) return false;
    const daysSinceActive = Math.round(
      (new Date(record.lastActiveDate).getTime() - d.getTime()) / 86_400_000
    );
    return daysSinceActive >= 0 && daysSinceActive < record.current;
  });
}

export function useStreak() {
  const [data, setData] = useState<StreakData>(DEFAULT_STREAK);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      // Dedicated streak storage key
      const streakKey = '@pulsefit/streak' as any;
      const streakRecord = await StorageService.getItem<StreakRecord>(streakKey);

      if (!streakRecord) {
        setData(DEFAULT_STREAK);
        return;
      }

      const yesterday = yesterdayISO();
      let { current, longest, lastActiveDate } = streakRecord;

      // Streak is broken if last active was before yesterday
      if (lastActiveDate < yesterday) {
        current = 0;
      }

      const weekActivity = buildWeeklyActivity({ ...streakRecord, current });

      setData({
        current,
        longest,
        weeklyActivity: weekActivity,
      });
    } catch (err) {
      console.warn('[useStreak] Failed to load streak:', err);
      setData(DEFAULT_STREAK);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, isLoading, refresh: load };
}
