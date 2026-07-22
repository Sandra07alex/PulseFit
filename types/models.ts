// Comprehensive Domain Types & Interfaces - PulseFit Architecture

import { CompanionId, CompanionMood } from '../components/mascot/types';

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export type GoalCategory = 'steps' | 'calories' | 'water' | 'workout' | 'weight' | 'sleep';

export interface Goal {
  id: string;
  userId: string;
  category: GoalCategory;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutIntensity = 'Low' | 'Moderate' | 'High' | 'Extreme';

export interface Workout {
  id: string;
  userId: string;
  title: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: WorkoutIntensity;
  notes?: string;
  completedAt: string;
  createdAt: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Food {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  servingSize: string;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  mealType: MealType;
  foodName: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  loggedAt: string;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  loggedAt: string;
}

export interface HydrationEntry extends WaterLog {
  amount: number;
  createdAt: Date;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: string;
  weightKg?: number;
  bodyFatPercentage?: number;
  notes?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeName: string;
  companionId: CompanionId;
  unlockedAt?: string;
  isUnlocked: boolean;
  progressPercentage: number;
}

export interface CompanionState {
  id: CompanionId;
  name: string;
  mood: CompanionMood;
  level: number;
  experiencePoints: number;
  lastInteractionAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'achievement' | 'goal' | 'system';
  read: boolean;
  scheduledTime?: string;
  createdAt: string;
}

export interface AppSettings {
  themeMode: 'light' | 'dark' | 'system';
  enableHaptics: boolean;
  enableNotifications: boolean;
  enableSound: boolean;
  unitSystem: 'metric' | 'imperial';
  waterRemindersEnabled: boolean;
  workoutRemindersEnabled: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  WorkoutDetail: { workoutId: string };
  NutritionDetail: { entryId: string };
  Settings: undefined;
  Modal: { type: string };
};
