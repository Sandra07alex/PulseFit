// Hydration types
export interface WaterGoal {
  dailyGoal: number; // in ml
  unit: 'ml' | 'l' | 'oz';
}

export interface HydrationStats {
  todayIntake: number;
  goal: number;
  percentage: number;
  cups: number;
  remaining: number;
}
