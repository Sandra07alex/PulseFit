/**
 * @file useFoodCatalog.ts
 * @description Hook for accessing and managing the food catalog.
 *
 * Provides:
 *  - All catalog items (with favorites first)
 *  - Toggle favorite action
 *  - Catalog loading state
 */

import { useState, useEffect, useCallback } from 'react';
import { FoodCatalogRepository } from '../repository/FoodCatalogRepository';
import type { FoodCatalogItem } from '../types/food.types';

export interface UseFoodCatalogResult {
  items:          FoodCatalogItem[];
  favorites:      FoodCatalogItem[];
  isLoading:      boolean;
  toggleFavorite: (id: string) => Promise<void>;
  refresh:        () => Promise<void>;
}

export function useFoodCatalog(): UseFoodCatalogResult {
  const [items,     setItems]     = useState<FoodCatalogItem[]>([]);
  const [favorites, setFavorites] = useState<FoodCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      // Seed catalog on first run
      await FoodCatalogRepository.seedCatalog();
      const all  = await FoodCatalogRepository.getAll();
      const favs = all.filter((item) => item.isFavorite);
      setItems(all);
      setFavorites(favs);
    } catch (err) {
      console.error('[useFoodCatalog] Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavorite = useCallback(async (id: string) => {
    await FoodCatalogRepository.toggleFavorite(id);
    // Optimistic local update
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    setFavorites((prev) => {
      const wasFav = prev.some((item) => item.id === id);
      if (wasFav) {
        return prev.filter((item) => item.id !== id);
      } else {
        const toggled = items.find((item) => item.id === id);
        if (toggled) return [...prev, { ...toggled, isFavorite: true }];
        return prev;
      }
    });
  }, [items]);

  return {
    items,
    favorites,
    isLoading,
    toggleFavorite,
    refresh: load,
  };
}
