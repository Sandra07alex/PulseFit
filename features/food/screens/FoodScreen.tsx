/**
 * @file FoodScreen.tsx
 * @description Main Food Tracking screen — the nutrition tab content.
 *
 * Layout:
 *  - DailyNutritionHeader (hero gradient card)
 *  - NutritionSummary (macro progress bars)
 *  - Meal Sections (Breakfast / Lunch / Dinner / Snacks)
 *  - FloatingAddFoodButton
 *  - DeleteFoodDialog (modal)
 *
 * Data: useFoodLogs + useNutritionTotals
 * Navigation: onAddFood → AddFoodScreen, onEdit → EditFoodScreen
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DailyNutritionHeader } from '../components/DailyNutritionHeader';
import { NutritionSummary }     from '../components/NutritionSummary';
import { MealSection }          from '../components/MealSection';
import { DeleteFoodDialog }     from '../components/DeleteFoodDialog';
import { FloatingAddFoodButton } from '../components/FloatingAddFoodButton';

import { useFoodLogs }         from '../hooks/useFoodLogs';
import { useNutritionTotals }  from '../hooks/useNutritionTotals';

import { colors }     from '../../../theme/colors';
import { spacing }    from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

import type { FoodLogEntry, MealType } from '../types/food.types';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export const FoodScreen: React.FC = () => {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();

  const {
    mealGroups,
    isLoading: logsLoading,
    deleteLog,
    refresh:   refreshLogs,
  } = useFoodLogs();

  const {
    progress,
    isLoading: totalsLoading,
    refresh:   refreshTotals,
  } = useNutritionTotals();

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<FoodLogEntry | null>(null);

  const isRefreshing = logsLoading || totalsLoading;

  const handleRefresh = useCallback(async () => {
    await Promise.all([refreshLogs(), refreshTotals()]);
  }, [refreshLogs, refreshTotals]);

  const handleAddFood = useCallback((mealType?: MealType) => {
    router.push({
      pathname: '/(app)/food/add',
      params:   mealType ? { mealType } : {},
    });
  }, [router]);

  const handleEditFood = useCallback((entry: FoodLogEntry) => {
    router.push({
      pathname: '/(app)/food/edit',
      params:   { logId: entry.id },
    });
  }, [router]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteLog(deleteTarget.id);
    await refreshTotals();
    setDeleteTarget(null);
  }, [deleteTarget, deleteLog, refreshTotals]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightMode.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 180, 200) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── Page title ────────────────────────────────────── */}
        <View style={[styles.pageHeader, { paddingTop: insets.top + spacing.lg }]}>
          <Text style={styles.pageTitle}>🥦 Nutrition</Text>
          <Text style={styles.pageSubtitle}>Nourish your body with clean energy</Text>
        </View>

        {/* ── Daily Nutrition Hero Card ─────────────────────── */}
        <DailyNutritionHeader progress={progress} />

        {/* ── Macro Progress Bars ───────────────────────────── */}
        <View style={styles.section}>
          <NutritionSummary progress={progress} />
        </View>

        {/* ── Meal Sections ─────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <View style={styles.mealList}>
            {mealGroups.map((group) => (
              <MealSection
                key={group.mealType}
                group={group}
                onAddFood={() => handleAddFood(group.mealType)}
                onEdit={handleEditFood}
                onDelete={(entry) => setDeleteTarget(entry)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Floating Add Button ───────────────────────────── */}
      <FloatingAddFoodButton onPress={() => handleAddFood()} />

      {/* ── Delete Confirmation ───────────────────────────── */}
      <DeleteFoodDialog
        visible={deleteTarget !== null}
        entry={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
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
  scroll: {
    flex: 1,
  },
  content: {
    gap: 0,
  },
  pageHeader: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom:     spacing.md,
    gap:               2,
  },
  pageTitle: {
    fontSize:    typography.sizes['4xl'],
    fontWeight:  '900',
    color:       colors.lightMode.text,
    letterSpacing: -1,
  },
  pageSubtitle: {
    fontSize:  typography.sizes.base,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
  },
  section: {
    marginTop: spacing['3xl'],
    gap:       spacing.lg,
  },
  sectionTitle: {
    fontSize:    typography.sizes.xl,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    paddingHorizontal: spacing.screenPadding,
    letterSpacing: -0.4,
  },
  mealList: {
    gap: spacing.md,
  },
});
