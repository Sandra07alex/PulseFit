import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { DailySummary } from '../../types/models';

const getTodayDateStr = (): string => new Date().toISOString().split('T')[0];

class DailySummaryRepositoryImpl {
  async getAll(): Promise<DailySummary[]> {
    const items = await StorageService.getItem<DailySummary[]>(StorageKeys.DAILY_SUMMARIES);
    return items || [];
  }

  async getToday(): Promise<DailySummary | null> {
    return this.getByDate(getTodayDateStr());
  }

  async getByDate(dateStr: string): Promise<DailySummary | null> {
    const all = await this.getAll();
    const targetDate = dateStr.split('T')[0];
    return all.find((item) => item.date.split('T')[0] === targetDate) || null;
  }

  async create(data: Partial<DailySummary> & { date?: string }): Promise<DailySummary> {
    const all = await this.getAll();
    const dateStr = (data.date || getTodayDateStr()).split('T')[0];
    const newSummary: DailySummary = {
      date: dateStr,
      totalCalories: data.totalCalories || 0,
      totalProtein: data.totalProtein || 0,
      totalWaterMl: data.totalWaterMl || 0,
      totalWorkoutMinutes: data.totalWorkoutMinutes || 0,
      totalCaloriesBurned: data.totalCaloriesBurned || 0,
      workoutCount: data.workoutCount || 0,
    };
    const filtered = all.filter((item) => item.date.split('T')[0] !== dateStr);
    const updated = [newSummary, ...filtered];
    await StorageService.setItem(StorageKeys.DAILY_SUMMARIES, updated);
    return newSummary;
  }

  async update(dateStr: string, updates: Partial<DailySummary>): Promise<DailySummary | null> {
    const targetDate = dateStr.split('T')[0];
    const existing = await this.getByDate(targetDate);
    if (!existing) {
      return this.create({ date: targetDate, ...updates });
    }
    const updatedSummary = { ...existing, ...updates };
    const all = await this.getAll();
    const updatedList = all.map((item) => (item.date.split('T')[0] === targetDate ? updatedSummary : item));
    await StorageService.setItem(StorageKeys.DAILY_SUMMARIES, updatedList);
    return updatedSummary;
  }

  async delete(dateStr: string): Promise<boolean> {
    const targetDate = dateStr.split('T')[0];
    const all = await this.getAll();
    const filtered = all.filter((item) => item.date.split('T')[0] !== targetDate);
    if (filtered.length !== all.length) {
      await StorageService.setItem(StorageKeys.DAILY_SUMMARIES, filtered);
      return true;
    }
    return false;
  }
}

export const DailySummaryRepository = new DailySummaryRepositoryImpl();
