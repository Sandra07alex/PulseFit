import { WorkoutIntensity } from '../types/models';

const MET_VALUES: Record<string, number> = {
  Cardio: 8.0,
  Strength: 5.0,
  Flexibility: 3.0,
  Running: 9.8,
  Cycling: 7.5,
  Swimming: 8.3,
};

export const WorkoutCalculator = {
  calculateCaloriesBurned(
    category: string,
    durationMinutes: number,
    weightKg: number = 70,
    intensity: WorkoutIntensity = 'Moderate'
  ): number {
    const baseMet = MET_VALUES[category] || 6.0;
    const intensityMultiplier =
      intensity === 'Low' ? 0.8 : intensity === 'Moderate' ? 1.0 : intensity === 'High' ? 1.25 : 1.5;

    const met = baseMet * intensityMultiplier;
    // Calories = MET * weight (kg) * (duration in hours)
    const calories = met * weightKg * (durationMinutes / 60);
    return Math.round(calories);
  },
};
