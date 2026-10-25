import { StorageService } from './StorageService';
import { StorageKeys } from '../constants/StorageKeys';
import type { UserProfile } from '../types/models';
import { NutritionCalculator } from './NutritionCalculator';
import { WaterCalculator } from './WaterCalculator';

/** Daily calorie / protein / water targets for a body weight and fitness goal */
export function deriveDailyGoals(
  weightKg: number,
  goal: string
): Pick<UserProfile, 'calorieGoal' | 'proteinGoalGrams' | 'waterGoalMl'> {
  const macros = NutritionCalculator.calculateDailyMacros(
    weightKg || 70,
    goal === 'lose_fat' ? 'cut' : goal === 'build_muscle' ? 'bulk' : 'maintain'
  );
  return {
    calorieGoal: macros.calories,
    proteinGoalGrams: macros.proteinGrams,
    waterGoalMl: WaterCalculator.calculateDailyTargetMl(weightKg || 70),
  };
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Athlete',
  age: 26,
  gender: 'male',
  heightCm: 175,
  weightKg: 70,
  targetWeightKg: 68,
  goal: 'stay_healthy',
  activityLevel: 'moderately_active',
  waterGoalMl: 2500,
  calorieGoal: 2000,
  proteinGoalGrams: 140,
  unitSystem: 'metric',
  reminderSettings: {
    preset: 'morning',
    time: '08:00 AM',
    enabled: true,
  },
  themePreference: 'system',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

class LocalProfileServiceImpl {
  async getProfile(): Promise<UserProfile | null> {
    try {
      const profile = await StorageService.getItem<UserProfile>(StorageKeys.USER_PROFILE);
      return profile;
    } catch (error) {
      console.error('[LocalProfileService] Error reading profile:', error);
      return null;
    }
  }

  async isProfileCreated(): Promise<boolean> {
    const profile = await this.getProfile();
    return !!profile;
  }

  async createProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const now = new Date().toISOString();
    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    await StorageService.setItem(StorageKeys.USER_PROFILE, newProfile);
    return newProfile;
  }

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile | null> {
    const existing = await this.getProfile();
    const base = existing || DEFAULT_PROFILE;
    const now = new Date().toISOString();
    // Targets are derived from weight + goal, so keep them in step when either changes
    const bodyChanged =
      (data.weightKg !== undefined && data.weightKg !== base.weightKg) ||
      (data.goal !== undefined && data.goal !== base.goal);
    const updated: UserProfile = {
      ...base,
      ...(bodyChanged ? deriveDailyGoals(data.weightKg ?? base.weightKg, data.goal ?? base.goal) : {}),
      ...data,
      updatedAt: now,
    };
    await StorageService.setItem(StorageKeys.USER_PROFILE, updated);
    return updated;
  }

  async deleteProfile(): Promise<void> {
    await StorageService.removeItem(StorageKeys.USER_PROFILE);
  }
}

export const LocalProfileService = new LocalProfileServiceImpl();
