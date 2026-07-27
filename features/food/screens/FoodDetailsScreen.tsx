/**
 * @file FoodDetailsScreen.tsx
 * @description Food detail view with quantity selector, live nutrition preview, and meal selector.
 *
 * Flow: Select quantity → Live preview updates → Choose meal → Save → Back to FoodScreen
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
  CATEGORY_EMOJI,
} from '../types/food.types';
import type {
  FoodCatalogItem,
  MealType,
  ServingUnit,
  NutritionTotals,
} from '../types/food.types';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export const FoodDetailsScreen: React.FC = () => {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const params  = useLocalSearchParams<{ foodId: string; mealType?: MealType }>();

  const { createLog } = useFoodLogs();

  const [food,      setFood]      = useState<FoodCatalogItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving,  setIsSaving]  = useState(false);

  const [quantity,  setQuantity]  = useState(100);
  const [unit,      setUnit]      = useState<ServingUnit>('g');
  const [mealType,  setMealType]  = useState<MealType>(params.mealType ?? 'Breakfast');
  const [nutrition, setNutrition] = useState<NutritionTotals>({
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  });

  // Load food from catalog
  useEffect(() => {
    (async () => {
      try {
        const found = await FoodCatalogRepository.getById(params.foodId);
        if (found) {
          setFood(found);
          setQuantity(found.servingSize);
          setUnit(found.servingUnit);
          setNutrition(calculateNutrition(found, found.servingSize));
        }
      } catch (err) {
        console.error('[FoodDetailsScreen] Load error:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [params.foodId]);

  // Recalculate nutrition whenever quantity or food changes
  useEffect(() => {
    if (!food) return;
    setNutrition(calculateNutrition(food, quantity));
  }, [food, quantity]);

  const handleSave = useCallback(async () => {
    if (!food || isSaving) return;
    setIsSaving(true);
    try {
      await createLog({
        foodId:      food.id,
        foodName:    food.name,
        mealType,
        quantity,
        servingUnit: unit,
        food,
      });
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to save food log. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [food, mealType, quantity, unit, createLog, isSaving, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingState}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!food) {
    return (
      <View style={styles.loadingState}>
        <Text style={styles.errorText}>Food not found.</Text>
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
        <Text style={styles.title} numberOfLines={1}>{food.name}</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 120, 140) },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Food Info ─────────────────────────────────── */}
        <View style={styles.foodInfo}>
          <View style={[styles.foodIconWrap, { backgroundColor: colors.primarySoft }]}>
            <Text style={styles.foodIcon}>{CATEGORY_EMOJI[food.category]}</Text>
          </View>
          <View style={styles.foodMeta}>
            <Text style={styles.foodName}>{food.name}</Text>
            {food.brand && <Text style={styles.foodBrand}>{food.brand}</Text>}
            <Text style={styles.foodCategory}>{food.category}</Text>
          </View>
        </View>

        {/* ── Live Nutrition Preview ────────────────────── */}
        <View style={styles.section}>
          <NutritionPreviewCard
            nutrition={nutrition}
            foodName={food.name}
            quantity={quantity}
            unit={unit}
          />
        </View>

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
          <Text style={styles.sectionLabel}>Add to Meal</Text>
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
          accessibilityLabel="Add food to log"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.saveBtnText}>
              Add {nutrition.calories} kcal to {mealType}
            </Text>
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
  content: {
    padding:    spacing.screenPadding,
    gap:        spacing.xl,
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.lg,
  },
  foodIconWrap: {
    width:          64,
    height:         64,
    borderRadius:   radius.md,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  foodIcon: { fontSize: 32 },
  foodMeta: {
    flex: 1,
    gap:  4,
  },
  foodName: {
    fontSize:    typography.sizes.xl,
    fontWeight:  '800',
    color:       colors.lightMode.text,
    letterSpacing: -0.4,
  },
  foodBrand: {
    fontSize:  typography.sizes.sm,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
  },
  foodCategory: {
    fontSize:  typography.sizes.xs,
    fontWeight: '500',
    color:     colors.lightMode.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    gap: spacing.md,
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
    backgroundColor: colors.companions.brocco.primary,
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
