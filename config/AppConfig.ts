// Application Environment & Feature Configuration

export interface FeatureFlags {
  enableHaptics: boolean;
  enableAnalytics: boolean;
  enableNotifications: boolean;
  enableMascotReactions: boolean;
  enableOfflineCache: boolean;
  enableDebugLogs: boolean;
}

export interface EnvironmentConfig {
  env: 'development' | 'staging' | 'production';
  appName: string;
  version: string;
  buildNumber: string;
  apiBaseUrl: string;
  apiTimeoutMs: number;
  featureFlags: FeatureFlags;
}

const isDev = __DEV__;

export const AppConfig: EnvironmentConfig = {
  env: isDev ? 'development' : 'production',
  appName: 'PulseFit',
  version: '1.0.0',
  buildNumber: '100',
  apiBaseUrl: isDev ? 'https://api.dev.pulsefit.app/v1' : 'https://api.pulsefit.app/v1',
  apiTimeoutMs: 10000,
  featureFlags: {
    enableHaptics: true,
    enableAnalytics: !isDev,
    enableNotifications: true,
    enableMascotReactions: true,
    enableOfflineCache: true,
    enableDebugLogs: isDev,
  },
};
