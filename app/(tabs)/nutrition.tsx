/**
 * @file app/(tabs)/nutrition.tsx
 * @description Nutrition tab — renders the Phase 11 Food Tracking screen.
 *
 * The FoodScreen is fully self-contained with its own data hooks,
 * floating button, and delete dialog. This file is just a thin route wrapper.
 */

import React, { useEffect } from 'react';
import { FoodScreen }        from '../../features/food/screens/FoodScreen';
import { seedFoodCatalog }   from '../../features/food/seed';

export default function NutritionTab() {
  // Ensure the food catalog is seeded on the first time this tab is visited.
  // seedFoodCatalog() is idempotent — it checks the seeded flag before writing.
  useEffect(() => {
    seedFoodCatalog().catch(console.error);
  }, []);

  return <FoodScreen />;
}
