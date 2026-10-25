/**
 * @file useNutritionTotals.ts
 * @description Hook that computes today's nutrition progress against profile goals.
 */

import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { FoodLogRepository } from '../repository/FoodLogRepository';
import { LocalProfileService } from '../../../services/LocalProfileService';
import {
  buildNutritionProgress,
  deriveDefaultGoals,
} from '../utils/nutritionCalculator';
import type { NutritionProgress, NutritionTotals } from '../types/food.types';

const EMPTY_TOTALS: NutritionTotals = {
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
};

export interface UseNutritionTotalsResult {
  progress:  NutritionProgress;
  isLoading: boolean;
  refresh:   () => Promise<void>;
}

export function useNutritionTotals(): UseNutritionTotalsResult {
  const [progress,  setProgress]  = useState<NutritionProgress>({
    totals:      EMPTY_TOTALS,
    goals:       { calories: 2000, protein: 140, carbs: 250, fat: 56, fiber: 30 },
    remaining:   { calories: 2000, protein: 140, carbs: 250, fat: 56, fiber: 30 },
    percentages: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setIsLoading(true);
      const [totals, profile] = await Promise.all([
        FoodLogRepository.getNutritionTotals(),
        LocalProfileService.getProfile(),
      ]);

      const calGoal = profile?.calorieGoal ?? 2000;
      const proGoal = profile?.proteinGoalGrams ?? 140;
      const goals   = deriveDefaultGoals(calGoal, proGoal);

      setProgress(buildNutritionProgress(totals, goals));
    } catch (err) {
      console.error('[useNutritionTotals] Load error:', err);
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

  return { progress, isLoading, refresh: () => load() };
}
