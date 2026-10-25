/**
 * @file seed/index.ts
 * @description Food catalog seeding logic.
 *
 * Seeds the local food database from the bundled foods.json on first app launch.
 * If the catalog already exists (seeded flag is set), does nothing.
 * Safe to call on every app start — it is idempotent.
 */

import { StorageService } from '../../../services/StorageService';
import { StorageKeys } from '../../../constants/StorageKeys';
import type { FoodCatalogItem } from '../types/food.types';

// Bundled seed data — compiled into the app bundle at build time
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SEED_DATA: FoodCatalogItem[] = require('./foods.json');

/**
 * Seeds the food catalog on first launch.
 *
 * Strategy:
 * 1. Check if the FOOD_CATALOG_SEEDED flag is set.
 * 2. If already seeded, return immediately.
 * 3. If not, write all seed items to FOOD_CATALOG storage.
 * 4. Set the seeded flag.
 *
 * This ensures user-added foods and favorites are never overwritten.
 * Concurrent callers share one in-flight run, so reads can safely await it.
 */
let seeding: Promise<void> | null = null;

export function seedFoodCatalog(): Promise<void> {
  seeding ??= runSeed();
  return seeding;
}

async function runSeed(): Promise<void> {
  try {
    const alreadySeeded = await StorageService.getItem<boolean>(
      StorageKeys.FOOD_CATALOG_SEEDED
    );

    if (alreadySeeded) {
      return; // Catalog already seeded — do nothing
    }

    // Check if there's already data (belt + suspenders)
    const existing = await StorageService.getItem<FoodCatalogItem[]>(
      StorageKeys.FOOD_CATALOG
    );

    if (existing && existing.length > 0) {
      // Data exists even without the flag — set flag and bail
      await StorageService.setItem(StorageKeys.FOOD_CATALOG_SEEDED, true);
      return;
    }

    // Write seed data
    await StorageService.setItem<FoodCatalogItem[]>(
      StorageKeys.FOOD_CATALOG,
      SEED_DATA
    );

    // Mark as seeded
    await StorageService.setItem(StorageKeys.FOOD_CATALOG_SEEDED, true);

    console.info(`[FoodSeed] Seeded ${SEED_DATA.length} foods into local catalog.`);
  } catch (error) {
    console.error('[FoodSeed] Failed to seed food catalog:', error);
    // Non-fatal: app can function without seed (user can add manually)
  }
}

/** Returns the count of seed items (for testing/verification) */
export function getSeedCount(): number {
  return SEED_DATA.length;
}
