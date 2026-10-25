import { StorageKey } from '../constants/StorageKeys';

/**
 * StorageService - Typed persistent key-value storage service with in-memory fallback.
 */
class StorageServiceImpl {
  private memoryCache = new Map<string, string>();
  /** Per-key tail of pending updates, so read-modify-write calls never interleave */
  private queues = new Map<string, Promise<unknown>>();

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

  /**
   * Atomically read, transform and write a key. Calls for the same key run one at a time,
   * so two quick taps can't both read the old list and drop each other's entry.
   */
  update<T>(key: StorageKey, fn: (current: T | null) => T | Promise<T>): Promise<T> {
    const prev = this.queues.get(key) ?? Promise.resolve();
    const next = prev
      .catch(() => {})
      .then(async () => {
        const value = await fn(await this.getItem<T>(key));
        await this.setItem<T>(key, value);
        return value;
      });
    this.queues.set(key, next);
    return next;
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
