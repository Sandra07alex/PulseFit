/**
 * @file useFoodSearch.ts
 * @description Debounced food search hook with recent + favorite priority.
 *
 * Features:
 *  - Instant local search (debounced 200ms)
 *  - Category filter support
 *  - Results: Recent foods first (if no query), then all results
 *  - Loading indicator during search
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { FoodCatalogRepository } from '../repository/FoodCatalogRepository';
import { FoodLogRepository } from '../repository/FoodLogRepository';
import type { FoodCatalogItem, FoodCategory } from '../types/food.types';

const DEBOUNCE_MS = 200;

export interface UseFoodSearchResult {
  query:            string;
  setQuery:         (q: string) => void;
  results:          FoodCatalogItem[];
  isSearching:      boolean;
  selectedCategory: FoodCategory | null;
  setCategory:      (cat: FoodCategory | null) => void;
  clearSearch:      () => void;
}

export function useFoodSearch(): UseFoodSearchResult {
  const [query,            setQueryState]   = useState('');
  const [results,          setResults]      = useState<FoodCatalogItem[]>([]);
  const [isSearching,      setIsSearching]  = useState(false);
  const [selectedCategory, setSelectedCat]  = useState<FoodCategory | null>(null);

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const performSearch = useCallback(
    async (q: string, category: FoodCategory | null) => {
      setIsSearching(true);
      try {
        const searchResults = await FoodCatalogRepository.search(
          q,
          category ?? undefined
        );
        setResults(searchResults);
      } catch (err) {
        console.error('[useFoodSearch] Search error:', err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Debounced search
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        performSearch(newQuery, selectedCategory);
      }, DEBOUNCE_MS);
    },
    [selectedCategory, performSearch]
  );

  // When category changes, re-search immediately
  const setCategory = useCallback(
    (cat: FoodCategory | null) => {
      setSelectedCat(cat);
      performSearch(query, cat);
    },
    [query, performSearch]
  );

  // Initial load
  useEffect(() => {
    performSearch('', null);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const clearSearch = useCallback(() => {
    setQueryState('');
    setSelectedCat(null);
    performSearch('', null);
  }, [performSearch]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    selectedCategory,
    setCategory,
    clearSearch,
  };
}
