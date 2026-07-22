import { AppConfig } from '../config/AppConfig';

/**
 * AnalyticsService - Telemetry and event tracking service interface.
 */
class AnalyticsServiceImpl {
  logScreen(screenName: string, params?: Record<string, any>): void {
    if (!AppConfig.featureFlags.enableAnalytics) return;
    console.log(`[Analytics] Screen: ${screenName}`, params || '');
  }

  logEvent(eventName: string, properties?: Record<string, any>): void {
    if (!AppConfig.featureFlags.enableAnalytics) return;
    console.log(`[Analytics] Event: ${eventName}`, properties || '');
  }

  setUserProperties(userId: string, properties?: Record<string, any>): void {
    if (!AppConfig.featureFlags.enableAnalytics) return;
    console.log(`[Analytics] User: ${userId}`, properties || '');
  }
}

export const AnalyticsService = new AnalyticsServiceImpl();
