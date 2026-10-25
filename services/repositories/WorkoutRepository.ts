import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { Workout } from '../../types/models';
import { localDateKey, isOnLocalDay } from '../../utils/date';
import { StreakService } from '../StreakService';

const getTodayDateStr = (): string => localDateKey();

const isSameDate = (dateA: string, dateB: string): boolean => {
  return isOnLocalDay(dateA, dateB);
};

class WorkoutRepositoryImpl {
  async getAll(): Promise<Workout[]> {
    const items = await StorageService.getItem<Workout[]>(StorageKeys.WORKOUT_LOGS);
    return items || [];
  }

  async getToday(): Promise<Workout[]> {
    return this.getByDate(getTodayDateStr());
  }

  async getByDate(dateStr: string): Promise<Workout[]> {
    const all = await this.getAll();
    return all.filter((entry) => isSameDate(entry.completedAt || entry.createdAt, dateStr));
  }

  async create(data: Omit<Workout, 'id' | 'createdAt'> & { id?: string }): Promise<Workout> {
    const now = new Date().toISOString();
    const newEntry: Workout = {
      id: data.id || `workout_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: data.userId || 'local_user',
      title: data.title || 'Workout',
      category: data.category || 'General',
      durationMinutes: Number(data.durationMinutes) || 0,
      caloriesBurned: Number(data.caloriesBurned) || 0,
      intensity: data.intensity || 'Moderate',
      notes: data.notes || '',
      completedAt: data.completedAt || now,
      createdAt: now,
    };
    await StorageService.update<Workout[]>(StorageKeys.WORKOUT_LOGS, (all) => [newEntry, ...(all ?? [])]);
    await StreakService.recordActivity(newEntry.completedAt);
    return newEntry;
  }

  async update(id: string, updates: Partial<Workout>): Promise<Workout | null> {
    const all = await this.getAll();
    let updatedItem: Workout | null = null;
    const updatedList = all.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });
    if (updatedItem) {
      await StorageService.setItem(StorageKeys.WORKOUT_LOGS, updatedList);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    let found = false;
    await StorageService.update<Workout[]>(StorageKeys.WORKOUT_LOGS, (all) => {
      const filtered = (all ?? []).filter((item) => item.id !== id);
      found = filtered.length !== (all ?? []).length;
      return filtered;
    });
    return found;
  }
}

export const WorkoutRepository = new WorkoutRepositoryImpl();
