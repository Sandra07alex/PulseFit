import { create } from 'zustand';
import { StorageService } from '../services/StorageService';
import { StorageKeys } from '../constants/StorageKeys';

export type GoalOption = 'lose_fat' | 'build_muscle' | 'stay_healthy' | 'improve_fitness' | 'increase_endurance';
export type ActivityLevelOption = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'athlete';
export type ReminderOption = 'morning' | 'afternoon' | 'evening' | 'custom';

export interface OnboardingData {
  step: number; // 1 to 8
  goal: GoalOption;
  unitSystem: 'metric' | 'imperial';
  heightCm: number;
  heightInches: number;
  weightKg: number;
  weightLbs: number;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  activityLevel: ActivityLevelOption;
  targetWeightKg?: number;
  targetWeightLbs?: number;
  reminderPreset: ReminderOption;
  reminderTime: string;
  isCompleted: boolean;
}

interface OnboardingStoreState extends OnboardingData {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  /** Resolves once the completion flag is saved */
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => void;
}

const STORAGE_KEY = StorageKeys.ONBOARDING;

const initialData: OnboardingData = {
  step: 1,
  goal: 'stay_healthy',
  unitSystem: 'metric',
  heightCm: 175,
  heightInches: 69,
  weightKg: 70,
  weightLbs: 154,
  age: 26,
  gender: 'male',
  activityLevel: 'moderately_active',
  targetWeightKg: 68,
  targetWeightLbs: 150,
  reminderPreset: 'morning',
  reminderTime: '08:00 AM',
  isCompleted: false,
};

export const useOnboardingStore = create<OnboardingStoreState>((set, get) => ({
  ...initialData,

  setStep: (step) => {
    const validStep = Math.min(8, Math.max(1, step));
    set({ step: validStep });
    StorageService.setItem(STORAGE_KEY, { ...get(), step: validStep });
  },

  nextStep: () => {
    const currentStep = get().step;
    if (currentStep < 8) {
      const next = currentStep + 1;
      set({ step: next });
      StorageService.setItem(STORAGE_KEY, { ...get(), step: next });
    }
  },

  prevStep: () => {
    const currentStep = get().step;
    if (currentStep > 1) {
      const prev = currentStep - 1;
      set({ step: prev });
      StorageService.setItem(STORAGE_KEY, { ...get(), step: prev });
    }
  },

  updateData: (data) => {
    set((state) => {
      const updated = { ...state, ...data };
      StorageService.setItem(STORAGE_KEY, updated);
      return updated;
    });
  },

  completeOnboarding: () => {
    set({ isCompleted: true });
    return StorageService.setItem(STORAGE_KEY, { ...get(), isCompleted: true });
  },

  resetOnboarding: () => {
    set({ ...initialData });
    StorageService.setItem(STORAGE_KEY, initialData);
  },
}));
