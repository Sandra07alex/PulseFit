import AsyncStorage from '@react-native-async-storage/async-storage';
import { Result } from '../types';

export class AsyncStorageAdapter {
  private static memoryCache = new Map<string, string>();

  /**
   * Helper to check if AsyncStorage is available and works
   */
  private static isStorageAvailable(): boolean {
    return !!AsyncStorage;
  }

  /**
   * Retrieves data from storage for a given key.
   */
  static async get<T>(key: string): Promise<Result<T | null>> {
    try {
      if (this.isStorageAvailable()) {
        const raw = await AsyncStorage.getItem(key);
        if (raw !== null) {
          try {
            const data = JSON.parse(raw) as T;
            return { success: true, data };
          } catch (parseError) {
            return { success: false, error: parseError instanceof Error ? parseError : new Error(String(parseError)) };
          }
        }
      }
    } catch (storageError) {
      // If native storage fails, we fall back to reading from in-memory cache
      console.warn(`[AsyncStorageAdapter] Failed to get item for key: ${key}. Falling back to memory.`, storageError);
    }

    // In-memory cache fallback
    const fallbackRaw = this.memoryCache.get(key);
    if (fallbackRaw !== undefined) {
      try {
        const data = JSON.parse(fallbackRaw) as T;
        return { success: true, data };
      } catch (parseError) {
        return { success: false, error: parseError instanceof Error ? parseError : new Error(String(parseError)) };
      }
    }

    return { success: true, data: null };
  }

  /**
   * Writes data to storage for a given key.
   */
  static async set<T>(key: string, value: T): Promise<Result<void>> {
    try {
      const stringified = JSON.stringify(value);
      this.memoryCache.set(key, stringified);

      if (this.isStorageAvailable()) {
        await AsyncStorage.setItem(key, stringified);
        return { success: true, data: undefined };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }
    return { success: true, data: undefined };
  }

  /**
   * Removes data from storage for a given key.
   */
  static async remove(key: string): Promise<Result<void>> {
    try {
      this.memoryCache.delete(key);

      if (this.isStorageAvailable()) {
        await AsyncStorage.removeItem(key);
        return { success: true, data: undefined };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }
    return { success: true, data: undefined };
  }

  /**
   * Clears all storage keys.
   */
  static async clear(): Promise<Result<void>> {
    try {
      this.memoryCache.clear();

      if (this.isStorageAvailable()) {
        await AsyncStorage.clear();
        return { success: true, data: undefined };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }
    return { success: true, data: undefined };
  }

  /**
   * Checks if a key exists in storage.
   */
  static async exists(key: string): Promise<Result<boolean>> {
    try {
      if (this.isStorageAvailable()) {
        const value = await AsyncStorage.getItem(key);
        return { success: true, data: value !== null };
      }
    } catch (error) {
      // Fail over to checking memory cache
    }
    return { success: true, data: this.memoryCache.has(key) };
  }

  /**
   * Merges partial data into an existing object in storage.
   */
  static async merge<T>(key: string, value: Partial<T>): Promise<Result<void>> {
    try {
      const currentResult = await this.get<T>(key);
      if (!currentResult.success) {
        return { success: false, error: currentResult.error };
      }

      const existingData = currentResult.data;
      const mergedData = existingData && typeof existingData === 'object'
        ? { ...existingData, ...value }
        : value as T;

      return await this.set<T>(key, mergedData);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new Error(String(error)) };
    }
  }
}
