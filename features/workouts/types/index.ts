// Workout types
export interface WorkoutSession {
  id: string;
  type: string;
  duration: number; // in minutes
  intensity: 'light' | 'moderate' | 'high';
  calories: number;
  exercises?: Exercise[];
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
}
