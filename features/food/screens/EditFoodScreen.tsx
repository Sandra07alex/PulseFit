/**
 * @file EditFoodScreen.tsx
 * @description Edit an existing food log entry.
 *
 * Allows changing:
 *  - Quantity
 *  - Serving unit
 *  - Meal type
 *
 * Shows live nutrition preview as quantity changes.
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NutritionPreviewCard } from '../components/NutritionPreviewCard';
import { QuantitySelector }     from '../components/QuantitySelector';

import { FoodCatalogRepository } from '../repository/FoodCatalogRepository';
import { FoodLogRepository }     from '../repository/FoodLogRepository';
import { useFoodLogs }           from '../hooks/useFoodLogs';
import { calculateNutrition }    from '../utils/nutritionCalculator';

import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';

import {
  MEAL_TYPES,
  MEAL_EMOJI,
} from '../types/food.types';
import type {
  FoodCatalogItem,
  FoodLogEntry,
  MealType,
  ServingUnit,
  NutritionTotals,
} from '../types/food.types';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export const EditFoodScreen: React.FC = () => {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ logId: string }>();

  const { updateLog, deleteLog } = useFoodLogs();

  const [log,       setLog]       = useState<FoodLogEntry | null>(null);
  const [food,      setFood]      = useState<FoodCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);

  const [quantity,  setQuantity]  = useState(100);
  const [unit,      setUnit]      = useState<ServingUnit>('g');
  const [mealType,  setMealType]  = useState<MealType>('Breakfast');
  const [nutrition, setNutrition] = useState<NutritionTotals>({
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  });

  // Load log + food from storage
  useEffect(() => {
    (async () => {
      try {
        const groups = await FoodLogRepository.getTodayMealGroups();
        let found: FoodLogEntry | undefined;
        for (const group of groups) {
          found = group.entries.find((e) => e.id === params.logId);
          if (found) break;
        }

        if (found) {
          setLog(found);
          setQuantity(found.quantity);
          setUnit(found.servingUnit);
          setMealType(found.mealType);

          const catalogFood = await FoodCatalogRepository.getById(found.foodId);
          if (catalogFood) {
            setFood(catalogFood);
            setNutrition(calculateNutrition(catalogFood, found.quantity));
          }
        }
      } catch (err) {
        console.error('[EditFoodScreen] Load error:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.logId]);

  // Live nutrition update
  useEffect(() => {
    if (!food) return;
    setNutrition(calculateNutrition(food, quantity));
  }, [food, quantity]);

  const handleSave = useCallback(async () => {
    if (!log || !food || isSaving) return;
    setIsSaving(true);
    try {
      await updateLog(log.id, quantity, mealType, unit);
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to update food log.');
    } finally {
      setIsSaving(false);
    }
  }, [log, food, quantity, mealType, unit, updateLog, isSaving, router]);

  const handleDelete = useCallback(() => {
    if (!log) return;
    Alert.alert(
      'Delete Food Log',
      `Remove ${log.foodName} from ${log.mealType}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteLog(log.id);
            router.back();
          },
        },
      ]
    );
  }, [log, deleteLog, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!log || !food) {
    return (
      <View style={styles.loadingState}>
        <Text style={styles.errorText}>Food log not found.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      {/* ── Header ────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>Edit Log</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 120, 140) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Food name (read-only) ─────────────────────── */}
        <View style={styles.foodBanner}>
          <Text style={styles.foodBannerName}>{food.name}</Text>
          <Text style={styles.foodBannerCategory}>{food.category}</Text>
        </View>

        {/* ── Live Nutrition Preview ────────────────────── */}
        <NutritionPreviewCard
          nutrition={nutrition}
          foodName={food.name}
          quantity={quantity}
          unit={unit}
        />

        {/* ── Quantity Selector ─────────────────────────── */}
        <View style={styles.sectionCard}>
          <QuantitySelector
            quantity={quantity}
            unit={unit}
            onQuantityChange={setQuantity}
            onUnitChange={setUnit}
            defaultServingSize={food.servingSize}
            defaultUnit={food.servingUnit}
          />
        </View>

        {/* ── Meal Selector ─────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Meal</Text>
          <View style={styles.mealGrid}>
            {MEAL_TYPES.map((meal) => (
              <TouchableOpacity
                key={meal}
                style={[styles.mealBtn, mealType === meal && styles.mealBtnActive]}
                onPress={() => setMealType(meal)}
                accessibilityRole="button"
                accessibilityLabel={meal}
                accessibilityState={{ selected: mealType === meal }}
              >
                <Text style={styles.mealBtnEmoji}>{MEAL_EMOJI[meal]}</Text>
                <Text style={[styles.mealBtnText, mealType === meal && styles.mealBtnTextActive]}>
                  {meal}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ── Save Button ────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Save changes"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
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
  loadingState: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    backgroundColor: colors.lightMode.background,
  },
  errorText: {
    fontSize:  typography.sizes.xl,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical:   spacing.lg,
    gap:               spacing.md,
  },
  backBtn: { padding: 4 },
  backText: {
    fontSize:  typography.sizes.base,
    fontWeight: '700',
    color:     colors.primary,
  },
  title: {
    flex:        1,
    fontSize:    typography.sizes.xl,
    fontWeight:  '800',
    color:       colors.lightMode.text,
    letterSpacing: -0.4,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteText: {
    fontSize: 22,
  },
  content: {
    padding: spacing.screenPadding,
    gap:     spacing.xl,
  },
  foodBanner: {
    backgroundColor: colors.primarySoft,
    borderRadius:    radius.cardSmall,
    padding:         spacing.lg,
    gap:             4,
  },
  foodBannerName: {
    fontSize:    typography.sizes.xl,
    fontWeight:  '800',
    color:       colors.primary,
    letterSpacing: -0.4,
  },
  foodBannerCategory: {
    fontSize:  typography.sizes.sm,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionCard: {
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.card,
    padding:         spacing.xl,
    gap:             spacing.lg,
    ...shadows.card,
  },
  sectionLabel: {
    fontSize:   typography.sizes.sm,
    fontWeight: '700',
    color:      colors.lightMode.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mealGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           spacing.sm,
  },
  mealBtn: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
    borderRadius:      radius.pill,
    borderWidth:       2,
    borderColor:       colors.lightMode.border,
    backgroundColor:   colors.lightMode.surface,
  },
  mealBtnActive: {
    backgroundColor: colors.primary,
    borderColor:     colors.primary,
  },
  mealBtnEmoji: { fontSize: 16 },
  mealBtnText: {
    fontSize:  typography.sizes.base,
    fontWeight: '700',
    color:     colors.lightMode.textSecondary,
  },
  mealBtnTextActive: {
    color: colors.white,
  },
  footer: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop:        spacing.md,
    backgroundColor:   colors.lightMode.surface,
    borderTopWidth:    1,
    borderTopColor:    colors.lightMode.border,
    ...shadows.lg,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius:    radius.pill,
    height:          spacing.buttonHeight + 8,
    alignItems:      'center',
    justifyContent:  'center',
    ...shadows.button,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize:   typography.sizes.lg,
    fontWeight: '800',
    color:      colors.white,
    letterSpacing: -0.3,
  },
});
