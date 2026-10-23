// Workout constants
import type { ClayTint } from '../../../theme/clay';
import type { WorkoutIntensity } from '../../../types/models';

export const WORKOUT_TYPES = [
  'Cardio',
  'Strength',
  'Flexibility',
  'Sports',
  'Yoga',
  'Pilates',
  'HIIT',
  'Cycling',
  'Running',
  'Swimming',
] as const;

export const INTENSITY_LEVELS = ['light', 'moderate', 'high'] as const;

export const CALORIE_BURN_FACTORS = {
  light: 3,
  moderate: 5,
  high: 8,
} as const;

/** Daily active-minutes goal (shared with the dashboard) */
export const WORKOUT_GOAL_MINUTES = 30;

export interface WorkoutPreset {
  id: string;
  label: string;
  emoji: string;
  /** Key into WorkoutCalculator's MET table */
  category: string;
  tint: ClayTint;
}

export const WORKOUT_PRESETS: WorkoutPreset[] = [
  { id: 'walk', label: 'Walk', emoji: '🚶', category: 'Walking', tint: 'brocco' },
  { id: 'run', label: 'Run', emoji: '🏃', category: 'Running', tint: 'blaze' },
  { id: 'cycle', label: 'Cycle', emoji: '🚴', category: 'Cycling', tint: 'droppy' },
  { id: 'strength', label: 'Strength', emoji: '🏋️', category: 'Strength', tint: 'eggsy' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘', category: 'Flexibility', tint: 'luna' },
  { id: 'swim', label: 'Swim', emoji: '🏊', category: 'Swimming', tint: 'droppy' },
  { id: 'hiit', label: 'HIIT', emoji: '⚡', category: 'Cardio', tint: 'pulse' },
  { id: 'dance', label: 'Dance', emoji: '💃', category: 'Dance', tint: 'bubblegum' },
];

export const INTENSITY_OPTIONS: { value: WorkoutIntensity; label: string; emoji: string }[] = [
  { value: 'Low', label: 'Chill', emoji: '🌱' },
  { value: 'Moderate', label: 'Steady', emoji: '🙂' },
  { value: 'High', label: 'Spicy', emoji: '🌶️' },
  { value: 'Extreme', label: 'Beast', emoji: '🦖' },
];

export const DURATION_PRESETS = [10, 20, 30, 45, 60] as const;

export function presetForCategory(category: string): WorkoutPreset {
  return WORKOUT_PRESETS.find((p) => p.category === category || p.label === category) ?? WORKOUT_PRESETS[6];
}
