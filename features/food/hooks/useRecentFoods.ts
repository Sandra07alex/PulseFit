/**
 * @file useRecentFoods.ts
 * @description Hook for accessing recently-used foods (last 20, newest first).
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { FoodLogRepository } from '../repository/FoodLogRepository';
import { FoodCatalogRepository } from '../repository/FoodCatalogRepository';
import type { FoodCatalogItem } from '../types/food.types';

export interface UseRecentFoodsResult {
  recentFoods: FoodCatalogItem[];
  isLoading:   boolean;
  refresh:     () => Promise<void>;
}

export function useRecentFoods(): UseRecentFoodsResult {
  const [recentFoods, setRecentFoods] = useState<FoodCatalogItem[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const recentIds = await FoodLogRepository.getRecentFoodIds();

      // Fetch catalog items for each ID (preserve order)
      const foods: FoodCatalogItem[] = [];
      for (const id of recentIds) {
        const food = await FoodCatalogRepository.getById(id);
        if (food) foods.push(food);
      }

      setRecentFoods(foods);
    } catch (err) {
      console.error('[useRecentFoods] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reload on focus so a food logged from the details screen shows up on return
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { recentFoods, isLoading, refresh: load };
}
