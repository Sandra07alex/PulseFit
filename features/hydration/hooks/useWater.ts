/**
 * @file useWater.ts
 * @description Hook for water intake tracking.
 *
 * Wraps WaterRepository and exposes reactive state.
 * When any mutation fires, the state updates immediately (optimistic)
 * so no manual refresh is needed.
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { WaterRepository } from '../services/WaterRepository';
import { LocalProfileService } from '../../../services/LocalProfileService';
import type { WaterLog } from '../../../types/models';

export interface UseWaterReturn {
  /** Today's log entries, newest first */
  logs:          WaterLog[];
  /** Total ml consumed today */
  totalMl:       number;
  /** Daily goal in ml (from profile, default 2500) */
  goalMl:        number;
  /** Remaining ml to goal (never negative) */
  remainingMl:   number;
  /** Progress 0-100 */
  percentage:    number;
  /** True while initial load is running */
  isLoading:     boolean;
  /** Add water. Immediately updates state. */
  addWater:      (amountMl: number) => Promise<void>;
  /** Remove a specific log entry. Immediately updates state. */
  removeLog:     (id: string) => Promise<void>;
  /** Manual refresh (also called internally after each mutation) */
  refresh:       () => Promise<void>;
}

export function useWater(): UseWaterReturn {
  const [logs,      setLogs]      = useState<WaterLog[]>([]);
  const [totalMl,   setTotalMl]   = useState(0);
  const [goalMl,    setGoalMl]    = useState(2500);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [todayLogs, todayTotal, profile] = await Promise.all([
        WaterRepository.getToday(),
        WaterRepository.getTodayTotal(),
        LocalProfileService.getProfile(),
      ]);
      setLogs(todayLogs);
      setTotalMl(todayTotal);
      setGoalMl(profile?.waterGoalMl ?? 2500);
    } catch (err) {
      console.error('[useWater] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const addWater = useCallback(async (amountMl: number) => {
    // Optimistic update
    const newTotal = totalMl + Math.round(amountMl);
    setTotalMl(newTotal);

    await WaterRepository.create(amountMl);
    // Reload to get the authoritative state including the new log entry
    await load();
  }, [totalMl, load]);

  const removeLog = useCallback(async (id: string) => {
    // Find entry to optimistically subtract
    const entry = logs.find((l) => l.id === id);
    if (entry) {
      setTotalMl((prev) => Math.max(0, prev - entry.amountMl));
      setLogs((prev) => prev.filter((l) => l.id !== id));
    }

    await WaterRepository.delete(id);
    await load();
  }, [logs, load]);

  const remainingMl = Math.max(0, goalMl - totalMl);
  const percentage  = goalMl > 0 ? Math.min(100, Math.round((totalMl / goalMl) * 100)) : 0;

  return {
    logs,
    totalMl,
    goalMl,
    remainingMl,
    percentage,
    isLoading,
    addWater,
    removeLog,
    refresh: load,
  };
}
