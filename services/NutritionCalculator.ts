export interface MacroBreakdown {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export const NutritionCalculator = {
  calculateDailyMacros(weightKg: number, goal: 'maintain' | 'cut' | 'bulk' = 'maintain'): MacroBreakdown {
    let calories = Math.round(weightKg * 30);
    if (goal === 'cut') calories = Math.round(calories * 0.82);
    if (goal === 'bulk') calories = Math.round(calories * 1.15);

    const proteinGrams = Math.round(weightKg * 1.8);
    const fatGrams = Math.round((calories * 0.25) / 9);
    const carbsGrams = Math.round((calories - proteinGrams * 4 - fatGrams * 9) / 4);

    return {
      calories,
      proteinGrams,
      carbsGrams: Math.max(50, carbsGrams),
      fatGrams: Math.max(30, fatGrams),
    };
  },

  calculateTotalCalories(proteinG: number, carbsG: number, fatG: number): number {
    return Math.round(proteinG * 4 + carbsG * 4 + fatG * 9);
  },
};
