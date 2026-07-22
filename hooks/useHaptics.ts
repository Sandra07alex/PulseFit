import { AppConfig } from '../config/AppConfig';

export const useHaptics = () => {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    if (!AppConfig.featureFlags.enableHaptics) return;
    // Safe haptic feedback trigger
  };

  return {
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
  };
};
