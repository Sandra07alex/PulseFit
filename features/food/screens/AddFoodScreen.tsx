/**
 * @file AddFoodScreen.tsx
 * @description Search-and-add food flow.
 *
 * Layout:
 *  - Back header
 *  - FoodSearchBar (instant search)
 *  - FoodCategoryTabs (horizontal filter)
 *  - RecentFoods strip (when no query)
 *  - FavoriteFoods strip (when no query)
 *  - Search results list (FoodSearchItem rows)
 *
 * Navigation:
 *  - On item select → FoodDetailsScreen with foodId + mealType params
 */

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FoodSearchBar }     from '../components/FoodSearchBar';
import { FoodCategoryTabs }  from '../components/FoodCategoryTabs';
import { RecentFoods }       from '../components/RecentFoods';
import { FavoriteFoods }     from '../components/FavoriteFoods';
import { FoodSearchItem }    from '../components/FoodSearchItem';

import { useFoodSearch }     from '../hooks/useFoodSearch';
import { useRecentFoods }    from '../hooks/useRecentFoods';
import { useFoodCatalog }    from '../hooks/useFoodCatalog';

import { colors }     from '../../../theme/colors';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';

import type { FoodCatalogItem, MealType } from '../types/food.types';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export const AddFoodScreen: React.FC = () => {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ mealType?: MealType }>();

  const {
    query,
    setQuery,
    results,
    isSearching,
    selectedCategory,
    setCategory,
    clearSearch,
  } = useFoodSearch();

  const { recentFoods } = useRecentFoods();
  const { favorites, toggleFavorite } = useFoodCatalog();

  const hasQuery = query.trim().length > 0;

  const navigateToDetails = useCallback(
    (food: FoodCatalogItem) => {
      router.push({
        pathname: '/(app)/food/details',
        params: {
          foodId:   food.id,
          mealType: params.mealType ?? 'Breakfast',
        },
      });
    },
    [router, params.mealType]
  );

  const handleFavoriteToggle = useCallback(
    async (food: FoodCatalogItem) => {
      await toggleFavorite(food.id);
    },
    [toggleFavorite]
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightMode.background} />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Food</Text>
        {params.mealType && (
          <View style={styles.mealBadge}>
            <Text style={styles.mealBadgeText}>→ {params.mealType}</Text>
          </View>
        )}
      </View>

      {/* ── Search Bar ────────────────────────────────────── */}
      <View style={styles.searchWrap}>
        <FoodSearchBar
          value={query}
          onChangeText={setQuery}
          onClear={clearSearch}
          isLoading={isSearching}
          autoFocus
        />
      </View>

      {/* ── Category Tabs ─────────────────────────────────── */}
      <View style={styles.tabs}>
        <FoodCategoryTabs
          selected={selectedCategory}
          onSelect={setCategory}
        />
      </View>

      {/* ── Results ───────────────────────────────────────── */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          !hasQuery ? (
            <View style={styles.strips}>
              <RecentFoods foods={recentFoods} onSelect={navigateToDetails} />
              <FavoriteFoods
                foods={favorites}
                onSelect={navigateToDetails}
                onFavorite={handleFavoriteToggle}
              />
              {results.length > 0 && (
                <Text style={styles.allLabel}>All Foods</Text>
              )}
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isSearching && hasQuery ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                Try a different name or category
              </Text>
            </View>
          ) : isSearching ? (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <FoodSearchItem
            item={item}
            onPress={navigateToDetails}
            onFavorite={handleFavoriteToggle}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Math.max(insets.bottom + 20, 40) },
        ]}
        style={styles.flatList}
      />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: colors.lightMode.background,
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical:   spacing.lg,
    gap:               spacing.md,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    fontSize:  typography.sizes.base,
    fontWeight: '700',
    color:     colors.primary,
  },
  title: {
    flex:        1,
    fontSize:    typography.sizes['2xl'],
    fontWeight:  '800',
    color:       colors.lightMode.text,
    letterSpacing: -0.5,
  },
  mealBadge: {
    backgroundColor: colors.primarySoft,
    borderRadius:    999,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.xs,
  },
  mealBadgeText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.primary,
  },
  searchWrap: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom:      spacing.md,
  },
  tabs: {
    marginBottom: spacing.md,
  },
  flatList: {
    flex: 1,
  },
  list: {
    backgroundColor: colors.lightMode.surface,
    borderTopWidth:  1,
    borderTopColor:  colors.gray100,
  },
  strips: {
    paddingVertical: spacing.lg,
    gap:             spacing['2xl'],
    backgroundColor: colors.lightMode.background,
  },
  allLabel: {
    fontSize:    typography.sizes.base,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    paddingHorizontal: spacing.screenPadding,
    letterSpacing: -0.2,
  },
  empty: {
    alignItems:     'center',
    paddingVertical: spacing['5xl'],
    gap:             spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize:    typography.sizes.xl,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize:  typography.sizes.base,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
  },
  loading: {
    paddingVertical: spacing['5xl'],
    alignItems:      'center',
  },
});
