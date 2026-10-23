/**
 * @file FoodLogRepository.ts
 * @description Repository for managing food consumption log entries.
 *
 * Responsibilities:
 *  - CRUD on daily food logs
 *  - Aggregation (nutrition totals per day / per meal)
 *  - Recent foods tracking (last 20 unique foods, newest first)
 *  - Dashboard bridge: keeps legacy StorageKeys.NUTRITION_LOGS in sync
 *    so the existing useDashboardData hook updates automatically.
 *
 * Supabase-ready: All shapes mirror future remote table schemas.
 */

import { StorageService } from '../../../services/StorageService';
import { StorageKeys } from '../../../constants/StorageKeys';
import { sumNutritionFromLogs } from '../utils/nutritionCalculator';
import type {
  FoodLogEntry,
  MealType,
  MealGroup,
  NutritionTotals,
} from '../types/food.types';
import type { NutritionEntry } from '../../../types/models';
import { localDateKey, isOnLocalDay } from '../../../utils/date';
import { StreakService } from '../../../services/StreakService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function todayISO(): string {
  return localDateKey();
}

function generateId(): string {
  return `log_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Dashboard bridge
// ---------------------------------------------------------------------------

/**
 * Map a FoodLogEntry into the legacy NutritionEntry shape used by useDashboardData.
 * This keeps the Dashboard's calorie/protein metrics auto-updated.
 */
function toLegacyEntry(log: FoodLogEntry): NutritionEntry {
  return {
    id:           log.id,
    userId:       'local',
    mealType:     log.mealType === 'Snacks' ? 'Snack' : log.mealType as any,
    foodName:     log.foodName,
    calories:     log.calculatedCalories,
    proteinGrams: log.calculatedProtein,
    carbsGrams:   log.calculatedCarbs,
    fatGrams:     log.calculatedFat,
    loggedAt:     log.loggedAt,
    createdAt:    log.loggedAt,
    servingSize:  `${log.quantity}${log.servingUnit}`,
  };
}

class FoodLogRepositoryImpl {
  // ---------------------------------------------------------------------------
  // Internal storage
  // ---------------------------------------------------------------------------

  private async getAllLogs(): Promise<FoodLogEntry[]> {
    const logs = await StorageService.getItem<FoodLogEntry[]>(StorageKeys.FOOD_LOGS);
    return logs ?? [];
  }

  private async saveLogs(logs: FoodLogEntry[]): Promise<void> {
    await StorageService.setItem<FoodLogEntry[]>(StorageKeys.FOOD_LOGS, logs);
    // Sync to legacy storage for Dashboard compatibility
    await this.syncLegacyStorage(logs);
  }

  /** Keeps the old NUTRITION_LOGS key in sync for useDashboardData */
  private async syncLegacyStorage(logs: FoodLogEntry[]): Promise<void> {
    try {
      const legacy = logs.map(toLegacyEntry);
      await StorageService.setItem<NutritionEntry[]>(StorageKeys.NUTRITION_LOGS, legacy);
    } catch (err) {
      console.warn('[FoodLogRepository] Failed to sync legacy storage:', err);
    }
  }

  // ---------------------------------------------------------------------------
  // CRUD
  // ---------------------------------------------------------------------------

  /**
   * Create a new food log entry.
   */
  async create(entry: Omit<FoodLogEntry, 'id' | 'loggedAt'>): Promise<FoodLogEntry> {
    const logs = await this.getAllLogs();
    const newEntry: FoodLogEntry = {
      ...entry,
      id:       generateId(),
      loggedAt: new Date().toISOString(),
    };
    logs.push(newEntry);
    await this.saveLogs(logs);
    await StreakService.recordActivity(newEntry.loggedAt);
    await this.updateRecentFoods(entry.foodId);
    return newEntry;
  }

  /**
   * Update an existing food log entry.
   * Returns null if not found.
   */
  async update(
    id: string,
    updates: Partial<Omit<FoodLogEntry, 'id' | 'loggedAt'>>
  ): Promise<FoodLogEntry | null> {
    const logs  = await this.getAllLogs();
    const index = logs.findIndex((log) => log.id === id);
    if (index === -1) return null;

    logs[index] = { ...logs[index], ...updates };
    await this.saveLogs(logs);
    return logs[index];
  }

  /**
   * Delete a food log entry by ID.
   */
  async delete(id: string): Promise<boolean> {
    const logs    = await this.getAllLogs();
    const filtered = logs.filter((log) => log.id !== id);
    if (filtered.length === logs.length) return false; // not found
    await this.saveLogs(filtered);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  /**
   * Get all logs for today.
   */
  async getToday(): Promise<FoodLogEntry[]> {
    const today = todayISO();
    const logs  = await this.getAllLogs();
    return logs.filter((log) => isOnLocalDay(log.loggedAt, today));
  }

  /**
   * Get logs for a specific meal type (today only).
   */
  async getByMeal(mealType: MealType): Promise<FoodLogEntry[]> {
    const todayLogs = await this.getToday();
    return todayLogs.filter((log) => log.mealType === mealType);
  }

  /**
   * Get logs for a specific date (YYYY-MM-DD).
   */
  async getByDate(date: string): Promise<FoodLogEntry[]> {
    const logs = await this.getAllLogs();
    return logs.filter((log) => isOnLocalDay(log.loggedAt, date));
  }

  /**
   * Group today's logs by meal type and compute per-meal totals.
   */
  async getTodayMealGroups(): Promise<MealGroup[]> {
    const today = await this.getToday();
    const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

    return mealTypes.map((mealType) => {
      const entries = today.filter((log) => log.mealType === mealType);
      return {
        mealType,
        entries,
        totals: sumNutritionFromLogs(entries),
      };
    });
  }

  /**
   * Compute today's overall nutrition totals.
   */
  async getNutritionTotals(date?: string): Promise<NutritionTotals> {
    const logs = date ? await this.getByDate(date) : await this.getToday();
    return sumNutritionFromLogs(logs);
  }

  // ---------------------------------------------------------------------------
  // Recent Foods
  // ---------------------------------------------------------------------------

  /**
   * Get the list of recently-used food IDs (max 20, newest first).
   */
  async getRecentFoodIds(): Promise<string[]> {
    const recent = await StorageService.getItem<string[]>(StorageKeys.RECENT_FOOD_IDS);
    return recent ?? [];
  }

  /**
   * Update the recent foods list when a food is logged.
   * Keeps max 20 unique IDs, most recent first.
   */
  async updateRecentFoods(foodId: string): Promise<void> {
    try {
      const recent = await this.getRecentFoodIds();
      // Remove if already exists, then prepend
      const filtered = recent.filter((id) => id !== foodId);
      const updated  = [foodId, ...filtered].slice(0, 20);
      await StorageService.setItem(StorageKeys.RECENT_FOOD_IDS, updated);
    } catch (err) {
      console.warn('[FoodLogRepository] Failed to update recent foods:', err);
    }
  }

  /**
   * Clear all logs (for testing/reset).
   */
  async clearAll(): Promise<void> {
    await StorageService.setItem<FoodLogEntry[]>(StorageKeys.FOOD_LOGS, []);
    await StorageService.setItem<NutritionEntry[]>(StorageKeys.NUTRITION_LOGS, []);
  }
}

export const FoodLogRepository = new FoodLogRepositoryImpl();
