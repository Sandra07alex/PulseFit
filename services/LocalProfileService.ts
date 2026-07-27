import { StorageService } from './StorageService';
import { StorageKeys } from '../constants/StorageKeys';
import type { UserProfile } from '../types/models';

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
    const now = new Date().toISOString();
    const updated: UserProfile = {
      ...(existing || DEFAULT_PROFILE),
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
