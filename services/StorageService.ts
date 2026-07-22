import { StorageKey } from '../constants/StorageKeys';

/**
 * StorageService - Typed persistent key-value storage service with in-memory fallback.
 */
class StorageServiceImpl {
  private memoryCache = new Map<string, string>();

  private getNativeStorage() {
    try {
      return require('@react-native-async-storage/async-storage').default;
    } catch {
      return null;
    }
  }

  async getItem<T>(key: StorageKey): Promise<T | null> {
    try {
      const storage = this.getNativeStorage();
      if (storage) {
        const raw = await storage.getItem(key);
        if (raw !== null) {
          return JSON.parse(raw) as T;
        }
      }
    } catch {
      // Fallback to memory
    }

    const fallbackRaw = this.memoryCache.get(key);
    if (fallbackRaw) {
      return JSON.parse(fallbackRaw) as T;
    }
    return null;
  }

  async setItem<T>(key: StorageKey, value: T): Promise<void> {
    const stringified = JSON.stringify(value);
    this.memoryCache.set(key, stringified);
    try {
      const storage = this.getNativeStorage();
      if (storage) {
        await storage.setItem(key, stringified);
      }
    } catch (err) {
      console.warn(`[StorageService] Failed to set item ${key}`, err);
    }
  }

  async removeItem(key: StorageKey): Promise<void> {
    this.memoryCache.delete(key);
    try {
      const storage = this.getNativeStorage();
      if (storage) {
        await storage.removeItem(key);
      }
    } catch (err) {
      console.warn(`[StorageService] Failed to remove item ${key}`, err);
    }
  }

  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    try {
      const storage = this.getNativeStorage();
      if (storage) {
        await storage.clear();
      }
    } catch (err) {
      console.warn('[StorageService] Failed to clear storage', err);
    }
  }
}

export const StorageService = new StorageServiceImpl();
