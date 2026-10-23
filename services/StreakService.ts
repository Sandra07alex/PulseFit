import { StorageService } from './StorageService';
import { StorageKeys } from '../constants/StorageKeys';
import { localDateKey } from '../utils/date';
import type { StreakData, StreakRecord } from '../features/dashboard/types/dashboard.types';

/** How many days of history to keep for streak maths */
const HISTORY_DAYS = 400;

function shiftDay(key: string, delta: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return localDateKey(new Date(y, m - 1, d + delta));
}

/** Consecutive active days ending today (or yesterday, so a streak survives until tonight) */
function currentRun(days: Set<string>, today: string): number {
  let cursor = days.has(today) ? today : shiftDay(today, -1);
  let run = 0;
  while (days.has(cursor)) {
    run += 1;
    cursor = shiftDay(cursor, -1);
  }
  return run;
}

function longestRun(sortedDays: string[]): number {
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sortedDays) {
    run = prev && shiftDay(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/** [Sun … Sat] of the current week, true where the user logged something */
function weekFlags(days: Set<string>, now: Date): boolean[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + i);
    return days.has(localDateKey(d));
  });
}

class StreakServiceImpl {
  private async read(): Promise<StreakRecord | null> {
    return StorageService.getItem<StreakRecord>(StorageKeys.STREAK);
  }

  private summarize(activeDays: string[], now = new Date()): StreakData & { lastActiveDate: string } {
    const set = new Set(activeDays);
    const today = localDateKey(now);
    return {
      current: currentRun(set, today),
      longest: longestRun(activeDays),
      weeklyActivity: weekFlags(set, now),
      lastActiveDate: activeDays[activeDays.length - 1] ?? '',
    };
  }

  /** Mark a day as active. Called by every repository that logs something. */
  async recordActivity(at: Date | string = new Date()): Promise<void> {
    try {
      const key = localDateKey(at);
      const record = await this.read();
      const days = new Set(record?.activeDays ?? (record?.lastActiveDate ? [record.lastActiveDate] : []));
      if (days.has(key)) return;
      days.add(key);
      const activeDays = [...days].sort().slice(-HISTORY_DAYS);
      const summary = this.summarize(activeDays);
      await StorageService.setItem<StreakRecord>(StorageKeys.STREAK, {
        ...summary,
        longest: Math.max(summary.longest, record?.longest ?? 0),
        activeDays,
      });
    } catch (err) {
      console.warn('[StreakService] recordActivity failed:', err);
    }
  }

  async getStreak(): Promise<StreakData & { activeDays: string[] }> {
    const record = await this.read();
    const activeDays = record?.activeDays ?? [];
    const s = this.summarize(activeDays);
    return {
      current: s.current,
      longest: Math.max(s.longest, record?.longest ?? 0),
      weeklyActivity: s.weeklyActivity,
      activeDays,
    };
  }
}

export const StreakService = new StreakServiceImpl();
