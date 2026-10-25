/**
 * @file WaterRepository.ts
 * @description Repository for offline water intake tracking.
 *
 * Persists WaterLog entries to AsyncStorage via StorageService.
 * The WaterLog shape matches types/models.ts — no duplication.
 *
 * Dashboard integration: writes to StorageKeys.WATER_LOGS which
 * useDashboardData already reads. No dashboard code changes needed.
 */

import { StorageService } from '../../../services/StorageService';
import { StorageKeys }    from '../../../constants/StorageKeys';
import type { WaterLog }  from '../../../types/models';
import { localDateKey, isOnLocalDay } from '../../../utils/date';
import { StreakService } from '../../../services/StreakService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayISO(): string {
  return localDateKey();
}

function generateId(): string {
  return `water_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Repository implementation
// ---------------------------------------------------------------------------

class WaterRepositoryImpl {
  private async getAllLogs(): Promise<WaterLog[]> {
    const logs = await StorageService.getItem<WaterLog[]>(StorageKeys.WATER_LOGS);
    return logs ?? [];
  }

  private async saveLogs(logs: WaterLog[]): Promise<void> {
    await StorageService.setItem<WaterLog[]>(StorageKeys.WATER_LOGS, logs);
  }

  private updateLogs(fn: (logs: WaterLog[]) => WaterLog[]): Promise<WaterLog[]> {
    return StorageService.update<WaterLog[]>(StorageKeys.WATER_LOGS, (logs) => fn(logs ?? []));
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /**
   * Log a water intake entry.
   * @param amountMl - Amount of water in millilitres
   */
  async create(amountMl: number): Promise<WaterLog> {
    const entry: WaterLog = {
      id:       generateId(),
      userId:   'local',
      amountMl: Math.max(1, Math.round(amountMl)),
      loggedAt: new Date().toISOString(),
    };
    await this.updateLogs((logs) => [...logs, entry]);
    await StreakService.recordActivity(entry.loggedAt);
    return entry;
  }

  /**
   * Delete a water log entry by ID.
   * @returns true if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    let found = false;
    await this.updateLogs((logs) => {
      const filtered = logs.filter((log) => log.id !== id);
      found = filtered.length !== logs.length;
      return filtered;
    });
    return found;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * Get all water logs for today (newest first).
   */
  async getToday(): Promise<WaterLog[]> {
    const today = todayISO();
    const logs  = await this.getAllLogs();
    return logs
      .filter((log) => isOnLocalDay(log.loggedAt, today))
      .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  }

  /**
   * Get all water logs for a specific date (YYYY-MM-DD), newest first.
   */
  async getByDate(date: string): Promise<WaterLog[]> {
    const logs = await this.getAllLogs();
    return logs
      .filter((log) => isOnLocalDay(log.loggedAt, date))
      .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
  }

  /**
   * Compute today's total intake in ml.
   */
  async getTodayTotal(): Promise<number> {
    const logs = await this.getToday();
    return logs.reduce((sum, log) => sum + log.amountMl, 0);
  }

  /**
   * Clear all water logs (for testing / reset).
   */
  async clear(): Promise<void> {
    await this.saveLogs([]);
  }
}

export const WaterRepository = new WaterRepositoryImpl();
