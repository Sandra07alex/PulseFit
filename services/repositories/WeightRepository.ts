import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { WeightLog } from '../../types/models';
import { localDateKey, isOnLocalDay } from '../../utils/date';
import { StreakService } from '../StreakService';

const getTodayDateStr = (): string => localDateKey();

const isSameDate = (dateA: string, dateB: string): boolean => {
  return isOnLocalDay(dateA, dateB);
};

class WeightRepositoryImpl {
  async getAll(): Promise<WeightLog[]> {
    const items = await StorageService.getItem<WeightLog[]>(StorageKeys.WEIGHT_LOGS);
    return items || [];
  }

  async getToday(): Promise<WeightLog[]> {
    return this.getByDate(getTodayDateStr());
  }

  async getByDate(dateStr: string): Promise<WeightLog[]> {
    const all = await this.getAll();
    return all.filter((entry) => isSameDate(entry.date || entry.createdAt, dateStr));
  }

  async create(data: { weightKg: number; date?: string }): Promise<WeightLog> {
    const all = await this.getAll();
    const now = new Date().toISOString();
    const newEntry: WeightLog = {
      id: `weight_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      weightKg: Number(data.weightKg) || 0,
      date: data.date || getTodayDateStr(),
      createdAt: now,
    };
    const updated = [newEntry, ...all];
    await StorageService.setItem(StorageKeys.WEIGHT_LOGS, updated);
    await StreakService.recordActivity(newEntry.createdAt);
    return newEntry;
  }

  async update(id: string, updates: Partial<WeightLog>): Promise<WeightLog | null> {
    const all = await this.getAll();
    let updatedItem: WeightLog | null = null;
    const updatedList = all.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });
    if (updatedItem) {
      await StorageService.setItem(StorageKeys.WEIGHT_LOGS, updatedList);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const all = await this.getAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length !== all.length) {
      await StorageService.setItem(StorageKeys.WEIGHT_LOGS, filtered);
      return true;
    }
    return false;
  }
}

export const WeightRepository = new WeightRepositoryImpl();
