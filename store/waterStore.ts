// Water/Hydration store
import { create } from 'zustand';
import { HydrationEntry } from '~/types';

interface WaterStore {
  entries: HydrationEntry[];
  dailyTarget: number; // in ml
  todayIntake: number; // in ml
  loading: boolean;
  error: string | null;
  setEntries: (entries: HydrationEntry[]) => void;
  addEntry: (entry: HydrationEntry) => void;
  removeEntry: (entryId: string) => void;
  setDailyTarget: (target: number) => void;
  updateTodayIntake: (amount: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useWaterStore = create<WaterStore>((set) => ({
  entries: [],
  dailyTarget: 2000, // Default 2L
  todayIntake: 0,
  loading: false,
  error: null,

  setEntries: (entries) => set({ entries }),

  addEntry: (entry) =>
    set((state) => ({
      entries: [...state.entries, entry],
      todayIntake: state.todayIntake + entry.amount,
    })),

  removeEntry: (entryId) =>
    set((state) => {
      const entry = state.entries.find((e) => e.id === entryId);
      return {
        entries: state.entries.filter((e) => e.id !== entryId),
        todayIntake: entry ? state.todayIntake - entry.amount : state.todayIntake,
      };
    }),

  setDailyTarget: (target) => set({ dailyTarget: target }),
  updateTodayIntake: (amount) => set({ todayIntake: amount }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  clear: () =>
    set({
      entries: [],
      todayIntake: 0,
      error: null,
    }),
}));
