// Common types and interfaces
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Goal {
  id: string;
  userId: string;
  type: string;
  target: number;
  current: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workout {
  id: string;
  userId: string;
  type: string;
  duration: number;
  calories: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HydrationEntry {
  id: string;
  userId: string;
  amount: number; // in ml
  createdAt: Date;
}

export interface ProgressEntry {
  id: string;
  userId: string;
  weight?: number;
  measurements?: Record<string, number>;
  photos?: string[];
  notes?: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
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
