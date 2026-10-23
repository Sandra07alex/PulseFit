// Progress types
export interface BodyMeasurement {
  date: Date;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thighs?: number;
  arms?: number;
}

export interface ProgressPhoto {
  id: string;
  date: Date;
  photoUrl: string;
  notes?: string;
}

export interface ProgressMetrics {
  startDate: Date;
  currentDate: Date;
  startWeight?: number;
  currentWeight?: number;
  weightChange?: number;
  photos: ProgressPhoto[];
  measurements: BodyMeasurement[];
}

/** Totals for one local calendar day */
export interface DayTotals {
  day: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  waterMl: number;
  workoutMinutes: number;
}

export interface Badge {
  id: string;
  emoji: string;
  title: string;
  hint: string;
  tint: import('../../../theme/clay').ClayTint;
  unlocked: boolean;
}
