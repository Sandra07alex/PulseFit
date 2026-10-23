/**
 * @file dashboard.types.ts
 * @description Strongly-typed interfaces and DTOs for the PulseFit Dashboard feature.
 * Designed to be Supabase-ready in a future phase — field names mirror DB column conventions.
 */

import type { NutritionEntry, WaterLog, Workout, WeightLog } from '../../../types/models';

// ---------------------------------------------------------------------------
// Greeting
// ---------------------------------------------------------------------------

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GreetingData {
  /** e.g. "Good Morning" */
  greeting: string;
  /** e.g. "☀️" */
  emoji: string;
  /** e.g. "Ready to build another healthy day?" */
  subtitle: string;
  timeOfDay: TimeOfDay;
}

// ---------------------------------------------------------------------------
// Progress Metrics
// ---------------------------------------------------------------------------

export type MetricId = 'calories' | 'protein' | 'water' | 'workout';

export interface MetricProgress {
  id: MetricId;
  /** Display label */
  label: string;
  /** Emoji icon */
  icon: string;
  /** Current value today */
  current: number;
  /** Daily goal */
  goal: number;
  /** Unit string, e.g. "kcal", "g", "ml", "min" */
  unit: string;
  /** 0–100 */
  percentage: number;
  /** Goal - current (never negative) */
  remaining: number;
  /** Human-readable remaining string */
  remainingLabel: string;
  /** Companion ID for accent colour */
  companionId: 'blaze' | 'eggsy' | 'droppy' | 'brocco';
  /** Hex accent colour derived from companion */
  accentColor: string;
  /** Soft background colour for the card */
  softColor: string;
}

// ---------------------------------------------------------------------------
// Daily Score
// ---------------------------------------------------------------------------

export interface DailyScoreData {
  /** 0–100 composite wellness score */
  score: number;
  /** "low" | "moderate" | "great" | "perfect" */
  tier: 'low' | 'moderate' | 'great' | 'perfect';
  /** Hex colour matching tier */
  color: string;
  /** Short motivational label */
  label: string;
}

// ---------------------------------------------------------------------------
// Today's Summary
// ---------------------------------------------------------------------------

export interface TodaySummaryData {
  caloriesRemaining: number;
  proteinRemaining: number;
  waterRemainingMl: number;
  workoutStatus: 'not_started' | 'in_progress' | 'done';
  workoutMinutes: number;
  workoutGoalMinutes: number;
  dailyScore: DailyScoreData;
}

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

export interface StreakData {
  current: number;
  longest: number;
  /** 7-element array, true = logged activity that day (Sun…Sat) */
  weeklyActivity: boolean[];
}

// ---------------------------------------------------------------------------
// Recent Activity
// ---------------------------------------------------------------------------

export type ActivityType = 'meal' | 'water' | 'workout' | 'weight';

export interface RecentActivityEntry {
  id: string;
  type: ActivityType;
  icon: string;
  title: string;
  detail: string;
  timeLabel: string;
  accentColor: string;
  /** ISO timestamp used for newest-first ordering */
  timestamp?: string;
}

// ---------------------------------------------------------------------------
// Quick Actions
// ---------------------------------------------------------------------------

export interface QuickAction {
  id: 'food' | 'water' | 'workout' | 'weight';
  icon: string;
  label: string;
  /** Gradient colour pair */
  gradient: readonly [string, string];
  route: string;
}

// ---------------------------------------------------------------------------
// Dashboard Data (aggregate)
// ---------------------------------------------------------------------------

export interface DashboardData {
  greeting: GreetingData;
  userName: string;
  metrics: MetricProgress[];
  summary: TodaySummaryData;
  streak: StreakData;
  recentActivity: RecentActivityEntry[];
  isLoading: boolean;
  lastRefreshed: Date | null;
}

// ---------------------------------------------------------------------------
// Raw storage-layer shapes
// ---------------------------------------------------------------------------

/** Shape persisted under @pulsefit/streak */
export interface StreakRecord {
  current: number;
  longest: number;
  lastActiveDate: string; // ISO date string
  weeklyActivity: boolean[];
  /** Local day keys (YYYY-MM-DD) with any logged activity, oldest first */
  activeDays?: string[];
}
