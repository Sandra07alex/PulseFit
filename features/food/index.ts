/**
 * @file features/food/index.ts
 * @description Barrel export for the food tracking feature module.
 *
 * Import from 'features/food' to access all public API.
 * Supabase-ready: All types and interfaces are designed for future migration.
 */

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  FoodCatalogItem,
  FoodLogEntry,
  MealType,
  FoodCategory,
  ServingUnit,
  NutritionTotals,
  NutritionGoals,
  NutritionProgress,
  MealGroup,
  DailyNutrition,
  FoodSearchResult,
} from './types/food.types';

export {
  MEAL_TYPES,
  MEAL_EMOJI,
  MEAL_EMPTY_MESSAGE,
  FOOD_CATEGORIES,
  CATEGORY_EMOJI,
  SERVING_UNITS,
} from './types/food.types';

// ── Repositories ──────────────────────────────────────────────────────────
export { FoodCatalogRepository } from './repository/FoodCatalogRepository';
export { FoodLogRepository }     from './repository/FoodLogRepository';

// ── Seed ──────────────────────────────────────────────────────────────────
export { seedFoodCatalog, getSeedCount } from './seed';

// ── Utils ─────────────────────────────────────────────────────────────────
export {
  calculateNutrition,
  sumNutritionFromLogs,
  sumNutrition,
  getRemainingNutrition,
  getNutritionPercentages,
  buildNutritionProgress,
  deriveDefaultGoals,
} from './utils/nutritionCalculator';

// ── Hooks ─────────────────────────────────────────────────────────────────
export { useFoodCatalog }       from './hooks/useFoodCatalog';
export { useFoodLogs }          from './hooks/useFoodLogs';
export { useFoodSearch }        from './hooks/useFoodSearch';
export { useNutritionTotals }   from './hooks/useNutritionTotals';
export { useRecentFoods }       from './hooks/useRecentFoods';

// ── Components ────────────────────────────────────────────────────────────
export { DailyNutritionHeader } from './components/DailyNutritionHeader';
export { NutritionSummary }     from './components/NutritionSummary';
export { MealSection }          from './components/MealSection';
export { FoodLogCard }          from './components/FoodLogCard';
export { EmptyMealState }       from './components/EmptyMealState';
export { FoodCard }             from './components/FoodCard';
export { FoodSearchBar }        from './components/FoodSearchBar';
export { FoodSearchItem }       from './components/FoodSearchItem';
export { FoodCategoryTabs }     from './components/FoodCategoryTabs';
export { RecentFoods }          from './components/RecentFoods';
export { FavoriteFoods }        from './components/FavoriteFoods';
export { QuantitySelector }     from './components/QuantitySelector';
export { NutritionPreviewCard } from './components/NutritionPreviewCard';
export { MealProgressCard }     from './components/MealProgressCard';
export { DeleteFoodDialog }     from './components/DeleteFoodDialog';
export { FloatingAddFoodButton } from './components/FloatingAddFoodButton';

// ── Screens ───────────────────────────────────────────────────────────────
export { FoodScreen }        from './screens/FoodScreen';
export { AddFoodScreen }     from './screens/AddFoodScreen';
export { FoodDetailsScreen } from './screens/FoodDetailsScreen';
export { EditFoodScreen }    from './screens/EditFoodScreen';
