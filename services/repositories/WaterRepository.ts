import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { HydrationEntry } from '../../types/models';

const getTodayDateStr = (): string => new Date().toISOString().split('T')[0];

const isSameDate = (dateA: string, dateB: string): boolean => {
  return dateA.split('T')[0] === dateB.split('T')[0];
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
    const all = await this.getAll();
    const nowIso = new Date().toISOString();
    const newEntry: HydrationEntry = {
      id: `water_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: data.userId || 'local_user',
      amountMl: data.amount,
      amount: data.amount,
      loggedAt: data.loggedAt || nowIso,
      createdAt: new Date(),
    };
    const updated = [newEntry, ...all];
    await StorageService.setItem(StorageKeys.WATER_LOGS, updated);
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
    const all = await this.getAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length !== all.length) {
      await StorageService.setItem(StorageKeys.WATER_LOGS, filtered);
      return true;
    }
    return false;
  }
}

export const WaterRepository = new WaterRepositoryImpl();
