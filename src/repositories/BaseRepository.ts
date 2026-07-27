import { Result } from '../types';
import { AsyncStorageAdapter } from '../storage/AsyncStorageAdapter';
import { generateUUID } from '../utils/helpers';

export class BaseRepository<T extends { id: string; createdAt: string; updatedAt: string }> {
  protected storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * Retrieves all items in the collection.
   */
  async getAll(): Promise<Result<T[]>> {
    const result = await AsyncStorageAdapter.get<T[]>(this.storageKey);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: result.data ?? [] };
  }

  /**
   * Retrieves an item by its ID.
   */
  async getById(id: string): Promise<Result<T | null>> {
    const listResult = await this.getAll();
    if (!listResult.success) {
      return { success: false, error: listResult.error };
    }
    const item = listResult.data.find((x) => x.id === id) || null;
    return { success: true, data: item };
  }

  /**
   * Creates a new item in the collection, generating ID and timestamps.
   */
  async create(
    item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<T>> {
    const listResult = await this.getAll();
    if (!listResult.success) {
      return { success: false, error: listResult.error };
    }

    const newItem = {
      ...item,
      id: item.id || generateUUID(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
    } as unknown as T;

    const updatedList = [...listResult.data, newItem];
    const saveResult = await AsyncStorageAdapter.set(this.storageKey, updatedList);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }
    return { success: true, data: newItem };
  }

  /**
   * Updates an existing item in the collection by its ID.
   */
  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Result<T>> {
    const listResult = await this.getAll();
    if (!listResult.success) {
      return { success: false, error: listResult.error };
    }

    const index = listResult.data.findIndex((x) => x.id === id);
    if (index === -1) {
      return { success: false, error: new Error(`Item with id ${id} not found in key: ${this.storageKey}`) };
    }

    const existing = listResult.data[index];
    const updatedItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T;

    const updatedList = [...listResult.data];
    updatedList[index] = updatedItem;

    const saveResult = await AsyncStorageAdapter.set(this.storageKey, updatedList);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }
    return { success: true, data: updatedItem };
  }

  /**
   * Deletes an item from the collection by its ID.
   */
  async delete(id: string): Promise<Result<void>> {
    const listResult = await this.getAll();
    if (!listResult.success) {
      return { success: false, error: listResult.error };
    }

    const updatedList = listResult.data.filter((x) => x.id !== id);
    const saveResult = await AsyncStorageAdapter.set(this.storageKey, updatedList);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }
    return { success: true, data: undefined };
  }

  /**
   * Overwrites all items in the collection.
   */
  async replaceAll(items: T[]): Promise<Result<void>> {
    const saveResult = await AsyncStorageAdapter.set(this.storageKey, items);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }
    return { success: true, data: undefined };
  }

  /**
   * Clears the entire collection.
   */
  async clear(): Promise<Result<void>> {
    const saveResult = await AsyncStorageAdapter.remove(this.storageKey);
    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }
    return { success: true, data: undefined };
  }
}
