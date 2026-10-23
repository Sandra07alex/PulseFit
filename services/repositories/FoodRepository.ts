import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { NutritionEntry } from '../../types/models';
import { localDateKey, isOnLocalDay } from '../../utils/date';

const getTodayDateStr = (): string => localDateKey();

const isSameDate = (dateA: string, dateB: string): boolean => {
  return isOnLocalDay(dateA, dateB);
};

class FoodRepositoryImpl {
  async getAll(): Promise<NutritionEntry[]> {
    const items = await StorageService.getItem<NutritionEntry[]>(StorageKeys.NUTRITION_LOGS);
    return items || [];
  }

  async getToday(): Promise<NutritionEntry[]> {
    return this.getByDate(getTodayDateStr());
  }

  async getByDate(dateStr: string): Promise<NutritionEntry[]> {
    const all = await this.getAll();
    return all.filter((entry) => isSameDate(entry.loggedAt || entry.createdAt, dateStr));
  }

  async create(data: Omit<NutritionEntry, 'id' | 'createdAt'> & { id?: string }): Promise<NutritionEntry> {
    const all = await this.getAll();
    const now = new Date().toISOString();
    const newEntry: NutritionEntry = {
      id: data.id || `food_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: data.userId || 'local_user',
      mealType: data.mealType || 'Breakfast',
      foodName: data.foodName || 'Food Item',
      calories: Number(data.calories) || 0,
      proteinGrams: Number(data.proteinGrams) || 0,
      carbsGrams: Number(data.carbsGrams) || 0,
      fatGrams: Number(data.fatGrams) || 0,
      loggedAt: data.loggedAt || now,
      createdAt: now,
    };
    const updated = [newEntry, ...all];
    await StorageService.setItem(StorageKeys.NUTRITION_LOGS, updated);
    return newEntry;
  }

  async update(id: string, updates: Partial<NutritionEntry>): Promise<NutritionEntry | null> {
    const all = await this.getAll();
    let updatedItem: NutritionEntry | null = null;
    const updatedList = all.map((item) => {
      if (item.id === id) {
        updatedItem = { ...item, ...updates };
        return updatedItem;
      }
      return item;
    });
    if (updatedItem) {
      await StorageService.setItem(StorageKeys.NUTRITION_LOGS, updatedList);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const all = await this.getAll();
    const filtered = all.filter((item) => item.id !== id);
    if (filtered.length !== all.length) {
      await StorageService.setItem(StorageKeys.NUTRITION_LOGS, filtered);
      return true;
    }
    return false;
  }
}

export const FoodRepository = new FoodRepositoryImpl();
