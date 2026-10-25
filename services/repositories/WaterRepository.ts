import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { HydrationEntry } from '../../types/models';
import { localDateKey, isOnLocalDay } from '../../utils/date';
import { StreakService } from '../StreakService';

const getTodayDateStr = (): string => localDateKey();

const isSameDate = (dateA: string, dateB: string): boolean => {
  return isOnLocalDay(dateA, dateB);
};

class WaterRepositoryImpl {
  async getAll(): Promise<HydrationEntry[]> {
    const items = await StorageService.getItem<HydrationEntry[]>(StorageKeys.WATER_LOGS);
    return items || [];
  }

  async getToday(): Promise<HydrationEntry[]> {
    return this.getByDate(getTodayDateStr());
  }

  async getByDate(dateStr: string): Promise<HydrationEntry[]> {
    const all = await this.getAll();
    return all.filter((entry) => {
      const entryDate = entry.loggedAt || (entry.createdAt ? new Date(entry.createdAt).toISOString() : '');
      return isSameDate(entryDate, dateStr);
    });
  }

  async create(data: { amount: number; loggedAt?: string; userId?: string }): Promise<HydrationEntry> {
    const nowIso = new Date().toISOString();
    const newEntry: HydrationEntry = {
      id: `water_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: data.userId || 'local_user',
      amountMl: data.amount,
      amount: data.amount,
      loggedAt: data.loggedAt || nowIso,
      createdAt: new Date(),
    };
    await StorageService.update<HydrationEntry[]>(StorageKeys.WATER_LOGS, (all) => [newEntry, ...(all ?? [])]);
    await StreakService.recordActivity(newEntry.loggedAt);
    return newEntry;
  }

  async update(id: string, updates: Partial<HydrationEntry>): Promise<HydrationEntry | null> {
    const all = await this.getAll();
    let updatedItem: HydrationEntry | null = null;
    const updatedList = all.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates, amountMl: updates.amount ?? updates.amountMl ?? item.amountMl };
        return updatedItem;
      }
      return item;
    });
    if (updatedItem) {
      await StorageService.setItem(StorageKeys.WATER_LOGS, updatedList);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    let found = false;
    await StorageService.update<HydrationEntry[]>(StorageKeys.WATER_LOGS, (all) => {
      const filtered = (all ?? []).filter((item) => item.id !== id);
      found = filtered.length !== (all ?? []).length;
      return filtered;
    });
    return found;
  }
}

export const WaterRepository = new WaterRepositoryImpl();
