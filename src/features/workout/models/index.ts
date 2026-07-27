export interface Workout {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutId?: string; // Optional reference to a Workout definition
  title: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  notes?: string;
  completedAt: string; // ISO string representing when the workout was completed/logged
  createdAt: string;
  updatedAt: string;
}
