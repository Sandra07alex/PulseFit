export interface DailySummary {
  date: string; // YYYY-MM-DD format
  totalCalories: number;
  totalProtein: number;
  totalWaterMl: number;
  totalWorkoutMinutes: number;
  totalCaloriesBurned: number;
  workoutCount: number;
  weightKg?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  themeMode: 'light' | 'dark' | 'system';
  enableHaptics: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
  unitSystem: 'metric' | 'imperial';
  waterGoalMl: number;
  calorieGoal: number;
  proteinGoalGrams: number;
  waterRemindersEnabled: boolean;
  workoutRemindersEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Streak {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'food' | 'water' | 'workout' | 'weight';
  title: string;
  detail: string;
  timestamp: string; // ISO format string
  createdAt: string;
  updatedAt: string;
}
