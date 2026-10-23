import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AppConfig } from '../config/AppConfig';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const trigger = (type: HapticType = 'light') => {
  if (!AppConfig.featureFlags.enableHaptics || Platform.OS === 'web') return;
  const run = () => {
    switch (type) {
      case 'medium':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      case 'heavy':
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      case 'success':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      case 'warning':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      case 'error':
        return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      case 'light':
      default:
        return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };
  // Haptics are best-effort; unsupported devices simply do nothing
  run().catch(() => {});
};

const haptics = {
  light: () => trigger('light'),
  medium: () => trigger('medium'),
  heavy: () => trigger('heavy'),
  success: () => trigger('success'),
  warning: () => trigger('warning'),
  error: () => trigger('error'),
};

export const useHaptics = () => haptics;
