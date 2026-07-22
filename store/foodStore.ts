// Food/Nutrition store
import { create } from 'zustand';
import { NutritionEntry } from '~/types';

interface NutritionStore {
  entries: NutritionEntry[];
  dailyGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  loading: boolean;
  error: string | null;
  setEntries: (entries: NutritionEntry[]) => void;
  addEntry: (entry: NutritionEntry) => void;
  removeEntry: (entryId: string) => void;
  setDailyGoals: (goals: Partial<NutritionStore['dailyGoals']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useFoodStore = create<NutritionStore>((set) => ({
  entries: [],
  dailyGoals: {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65,
  },
  loading: false,
  error: null,

  setEntries: (entries) => set({ entries }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
    })),

  removeEntry: (entryId) =>
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== entryId),
    })),

  setDailyGoals: (goals) =>
    set((state) => ({
      dailyGoals: { ...state.dailyGoals, ...goals },
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clear: () =>
    set({
      entries: [],
      error: null,
    }),
}));
