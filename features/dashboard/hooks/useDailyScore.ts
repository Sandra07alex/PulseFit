/**
 * @file useDailyScore.ts
 * @description Computes a 0–100 daily wellness score from metric completion percentages.
 *
 * Weights:
 *   Calories  35 %
 *   Protein   25 %
 *   Water     25 %
 *   Workout   15 %
 */

import { useMemo } from 'react';
import type { DailyScoreData } from '../types/dashboard.types';
import { colors } from '../../../theme/colors';

interface MetricInputs {
  caloriesPct: number;   // 0–100
  proteinPct: number;    // 0–100
  waterPct: number;      // 0–100
  workoutPct: number;    // 0–100
}

const WEIGHTS = {
  calories: 0.35,
  protein:  0.25,
  water:    0.25,
  workout:  0.15,
} as const;

function computeScore(inputs: MetricInputs): number {
  const { caloriesPct, proteinPct, waterPct, workoutPct } = inputs;
  const raw =
    Math.min(caloriesPct, 100) * WEIGHTS.calories +
    Math.min(proteinPct, 100)  * WEIGHTS.protein  +
    Math.min(waterPct, 100)    * WEIGHTS.water    +
    Math.min(workoutPct, 100)  * WEIGHTS.workout;
  return Math.round(raw);
}

function getTier(score: number): DailyScoreData['tier'] {
  if (score >= 95) return 'perfect';
  if (score >= 70) return 'great';
  if (score >= 40) return 'moderate';
  return 'low';
}

function getTierColor(tier: DailyScoreData['tier']): string {
  switch (tier) {
    case 'perfect':  return colors.companions.pulse.primary;   // purple
    case 'great':    return colors.success;                     // green
    case 'moderate': return colors.warning;                     // amber
    case 'low':      return colors.companions.blaze.primary;   // red
  }
}

function getTierLabel(tier: DailyScoreData['tier']): string {
  switch (tier) {
    case 'perfect':  return 'Perfect Day! 🏆';
    case 'great':    return 'Great Progress! 🌟';
    case 'moderate': return 'Keep Going! 💪';
    case 'low':      return "Let's Start! 🚀";
  }
}

/**
 * Computes and memoises the daily wellness score.
 * Re-computes whenever any metric percentage changes.
 */
export function useDailyScore(inputs: MetricInputs): DailyScoreData {
  return useMemo<DailyScoreData>(() => {
    const score = computeScore(inputs);
    const tier  = getTier(score);
    return {
      score,
      tier,
      color: getTierColor(tier),
      label: getTierLabel(tier),
    };
  }, [inputs.caloriesPct, inputs.proteinPct, inputs.waterPct, inputs.workoutPct]);
}
