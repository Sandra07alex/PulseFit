// Goals store
import { create } from 'zustand';
import { Goal } from '~/types';

interface GoalStore {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  removeGoal: (goalId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useGoalStore = create<GoalStore>((set) => ({
  goals: [],
  loading: false,
  error: null,

  setGoals: (goals) => set({ goals }),

  addGoal: (goal) =>
    set((state) => ({
      goals: [...state.goals, goal],
    })),

  updateGoal: (goalId, updates) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g)),
    })),

  removeGoal: (goalId) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== goalId),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clear: () =>
    set({
      goals: [],
      error: null,
    }),
}));
