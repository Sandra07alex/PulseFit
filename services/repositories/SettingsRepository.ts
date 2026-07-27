import { StorageService } from '../StorageService';
import { StorageKeys } from '../../constants/StorageKeys';
import type { AppSettings } from '../../types/models';

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'system',
  enableHaptics: true,
  enableNotifications: true,
  enableSound: true,
  unitSystem: 'metric',
  waterRemindersEnabled: true,
  workoutRemindersEnabled: true,
};

class SettingsRepositoryImpl {
  async get(): Promise<AppSettings> {
    const saved = await StorageService.getItem<AppSettings>(StorageKeys.SETTINGS);
    return saved || DEFAULT_SETTINGS;
  }

  async update(updates: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.get();
    const updated = { ...current, ...updates };
    await StorageService.setItem(StorageKeys.SETTINGS, updated);
    return updated;
  }

  async reset(): Promise<AppSettings> {
    await StorageService.setItem(StorageKeys.SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
}

export const SettingsRepository = new SettingsRepositoryImpl();
