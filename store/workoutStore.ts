// Workout store
import { create } from 'zustand';
import { Workout } from '~/types';

interface WorkoutStore {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  setWorkouts: (workouts: Workout[]) => void;
  addWorkout: (workout: Workout) => void;
  removeWorkout: (workoutId: string) => void;
  updateWorkout: (workoutId: string, updates: Partial<Workout>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workouts: [],
  loading: false,
  error: null,

  setWorkouts: (workouts) => set({ workouts }),

  addWorkout: (workout) =>
    set((state) => ({
      workouts: [...state.workouts, workout],
    })),

  removeWorkout: (workoutId) =>
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== workoutId),
    })),

  updateWorkout: (workoutId, updates) =>
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === workoutId ? { ...w, ...updates } : w,
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clear: () =>
    set({
      workouts: [],
      error: null,
    }),
}));
