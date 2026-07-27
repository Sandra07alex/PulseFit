/**
 * @file FoodCatalogRepository.ts
 * @description Repository for managing the local food nutrition database.
 *
 * Responsibilities:
 *  - Seed the catalog on first launch
 *  - CRUD on food catalog items
 *  - Full-text search (name, brand, category)
 *  - Favorites management
 *
 * Supabase-ready: All method signatures are designed so that swapping
 * StorageService.getItem/setItem for a supabase client call requires
 * only internal changes, not changes to callers.
 */

import { StorageService } from '../../../services/StorageService';
import { StorageKeys } from '../../../constants/StorageKeys';
import { seedFoodCatalog } from '../seed';
import type { FoodCatalogItem, FoodCategory } from '../types/food.types';

class FoodCatalogRepositoryImpl {
  // ---------------------------------------------------------------------------
  // Internal helpers
  // ---------------------------------------------------------------------------

  private async getAll_raw(): Promise<FoodCatalogItem[]> {
    const items = await StorageService.getItem<FoodCatalogItem[]>(
      StorageKeys.FOOD_CATALOG
    );
    return items ?? [];
  }

  private async saveAll(items: FoodCatalogItem[]): Promise<void> {
    await StorageService.setItem<FoodCatalogItem[]>(StorageKeys.FOOD_CATALOG, items);
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Seed the catalog from the bundled foods.json on first app launch.
   * Idempotent — safe to call on every app start.
   */
  async seedCatalog(): Promise<void> {
    await seedFoodCatalog();
  }

  /**
   * Retrieve all food catalog items.
   * Favorites appear first, then sorted alphabetically.
   */
  async getAll(): Promise<FoodCatalogItem[]> {
    const items = await this.getAll_raw();
    return items.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Retrieve a single catalog item by ID.
   */
  async getById(id: string): Promise<FoodCatalogItem | null> {
    const items = await this.getAll_raw();
    return items.find((item) => item.id === id) ?? null;
  }

  /**
   * Full-text search across name, brand, and category.
   * Case-insensitive. Results sorted by relevance (exact match first).
   * Favorites are promoted to the top of equal-score results.
   *
   * @param query        - Search string
   * @param category     - Optional category filter
   */
  async search(query: string, category?: FoodCategory): Promise<FoodCatalogItem[]> {
    const allItems = await this.getAll_raw();
    const q = query.trim().toLowerCase();

    let filtered = allItems;

    // Apply category filter
    if (category) {
      filtered = filtered.filter((item) => item.category === category);
    }

    // If no query, return all (category filtered)
    if (!q) {
      return filtered.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return a.name.localeCompare(b.name);
      });
    }

    // Score each item
    const scored = filtered
      .map((item) => {
        const nameLower     = item.name.toLowerCase();
        const brandLower    = (item.brand ?? '').toLowerCase();
        const categoryLower = item.category.toLowerCase();

        let score = 0;
        if (nameLower === q)                          score += 100;
        else if (nameLower.startsWith(q))             score += 80;
        else if (nameLower.includes(q))               score += 60;
        if (brandLower.includes(q))                   score += 30;
        if (categoryLower.includes(q))                score += 20;
        if (item.isFavorite)                          score += 10;

        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map(({ item }) => item);
  }

  /**
   * Toggle the isFavorite flag for a catalog item.
   * Returns the updated item.
   */
  async toggleFavorite(id: string): Promise<FoodCatalogItem | null> {
    const items = await this.getAll_raw();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      isFavorite: !items[index].isFavorite,
      updatedAt:  new Date().toISOString(),
    };

    await this.saveAll(items);
    return items[index];
  }

  /**
   * Retrieve all favorited catalog items.
   */
  async getFavorites(): Promise<FoodCatalogItem[]> {
    const items = await this.getAll_raw();
    return items
      .filter((item) => item.isFavorite)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get items by category.
   */
  async getByCategory(category: FoodCategory): Promise<FoodCatalogItem[]> {
    const items = await this.getAll_raw();
    return items
      .filter((item) => item.category === category)
      .sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return a.name.localeCompare(b.name);
      });
  }
}

export const FoodCatalogRepository = new FoodCatalogRepositoryImpl();
