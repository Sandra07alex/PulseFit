/**
 * @file useFoodLogs.ts
 * @description Hook for managing today's food log entries.
 *
 * Provides:
 *  - Today's meal groups (Breakfast/Lunch/Dinner/Snacks)
 *  - Overall daily nutrition totals
 *  - CRUD operations (create, update, delete)
 *  - Loading / refreshing state
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { FoodLogRepository } from '../repository/FoodLogRepository';
import { FoodCatalogRepository } from '../repository/FoodCatalogRepository';
import { calculateNutrition } from '../utils/nutritionCalculator';
import type {
  FoodLogEntry,
  MealGroup,
  MealType,
  NutritionTotals,
  FoodCatalogItem,
  ServingUnit,
} from '../types/food.types';

export interface CreateLogPayload {
  foodId:            string;
  foodName:          string;
  mealType:          MealType;
  quantity:          number;
  servingUnit:       ServingUnit;
  food:              FoodCatalogItem; // used to calculate nutrition
  notes?:            string;
}

export interface UseFoodLogsResult {
  mealGroups:    MealGroup[];
  dailyTotals:   NutritionTotals;
  isLoading:     boolean;
  createLog:     (payload: CreateLogPayload) => Promise<FoodLogEntry>;
  updateLog:     (id: string, quantity: number, mealType: MealType, unit: ServingUnit) => Promise<void>;
  deleteLog:     (id: string) => Promise<void>;
  refresh:       () => Promise<void>;
}

const EMPTY_TOTALS: NutritionTotals = {
  calories: 0,
  protein:  0,
  carbs:    0,
  fat:      0,
  fiber:    0,
};

export function useFoodLogs(): UseFoodLogsResult {
  const [mealGroups,  setMealGroups]  = useState<MealGroup[]>([]);
  const [dailyTotals, setDailyTotals] = useState<NutritionTotals>(EMPTY_TOTALS);
  const [isLoading,   setIsLoading]   = useState(true);

  const load = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      const groups = await FoodLogRepository.getTodayMealGroups();
      const totals = await FoodLogRepository.getNutritionTotals();
      setMealGroups(groups);
      setDailyTotals(totals);
    } catch (err) {
      console.error('[useFoodLogs] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tabs stay mounted, so reload (quietly) whenever the screen regains focus —
  // otherwise food added or edited on another route never shows up here.
  useFocusEffect(
    useCallback(() => {
      load(false);
    }, [load])
  );

  const createLog = useCallback(async (payload: CreateLogPayload): Promise<FoodLogEntry> => {
    const nutrition = calculateNutrition(payload.food, payload.quantity, payload.servingUnit);
    const entry = await FoodLogRepository.create({
      foodId:             payload.foodId,
      foodName:           payload.foodName,
      mealType:           payload.mealType,
      quantity:           payload.quantity,
      servingUnit:        payload.servingUnit,
      calculatedCalories: nutrition.calories,
      calculatedProtein:  nutrition.protein,
      calculatedCarbs:    nutrition.carbs,
      calculatedFat:      nutrition.fat,
      calculatedFiber:    nutrition.fiber,
      notes:              payload.notes,
    });
    await load(); // Refresh all groups
    return entry;
  }, [load]);

  const updateLog = useCallback(
    async (id: string, quantity: number, mealType: MealType, unit: ServingUnit) => {
      // Get current log to find the food
      const allGroups = await FoodLogRepository.getTodayMealGroups();
      let currentLog: FoodLogEntry | undefined;
      for (const group of allGroups) {
        currentLog = group.entries.find((e) => e.id === id);
        if (currentLog) break;
      }
      if (!currentLog) return;

      // Re-fetch food for accurate nutrition calculation
      const food = await FoodCatalogRepository.getById(currentLog.foodId);
      if (!food) return;

      const nutrition = calculateNutrition(food, quantity, unit);

      await FoodLogRepository.update(id, {
        quantity,
        mealType,
        servingUnit:        unit,
        calculatedCalories: nutrition.calories,
        calculatedProtein:  nutrition.protein,
        calculatedCarbs:    nutrition.carbs,
        calculatedFat:      nutrition.fat,
        calculatedFiber:    nutrition.fiber,
      });
      await load();
    },
    [load]
  );

  const deleteLog = useCallback(async (id: string) => {
    await FoodLogRepository.delete(id);
    await load();
  }, [load]);

  return {
    mealGroups,
    dailyTotals,
    isLoading,
    createLog,
    updateLog,
    deleteLog,
    refresh: () => load(),
  };
}
