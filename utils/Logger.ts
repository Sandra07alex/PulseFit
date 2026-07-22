import { AppConfig } from '../config/AppConfig';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class LoggerImpl {
  debug(message: string, ...args: any[]): void {
    if (!AppConfig.featureFlags.enableDebugLogs) return;
    console.log(`[DEBUG] ${message}`, ...args);
  }

  info(message: string, ...args: any[]): void {
    console.info(`[INFO] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[WARN] ${message}`, ...args);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
  }
}

export const Logger = new LoggerImpl();
