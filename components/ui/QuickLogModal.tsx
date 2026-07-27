import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { FloatingModal } from './FloatingModal';
import { Button } from './Button';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { FoodRepository, WaterRepository, WorkoutRepository, WeightRepository } from '../../services/repositories';
import { useToast } from '../../hooks/useToast';
import { useHaptics } from '../../hooks/useHaptics';

export type QuickLogType = 'food' | 'water' | 'workout' | 'weight' | null;

interface QuickLogModalProps {
  type: QuickLogType;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  type,
  visible,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const haptics = useHaptics();

  // Food states
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [mealType, setMealType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch');

  // Water states
  const [waterAmount, setWaterAmount] = useState('250');

  // Workout states
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [workoutCalories, setWorkoutCalories] = useState('200');

  // Weight states
  const [weightKg, setWeightKg] = useState('70');

  const [loading, setLoading] = useState(false);

  const resetFields = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setWaterAmount('250');
    setWorkoutTitle('');
    setDuration('30');
    setWorkoutCalories('200');
    setWeightKg('70');
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    haptics.medium();
    setLoading(true);
    try {
      if (type === 'food') {
        const calNum = parseInt(calories, 10) || 0;
        const protNum = parseInt(protein, 10) || 0;
        const name = foodName.trim() || 'Logged Meal';
        await FoodRepository.create({
          foodName: name,
          calories: calNum,
          proteinGrams: protNum,
          carbsGrams: Math.round(calNum * 0.4 / 4),
          fatGrams: Math.round(calNum * 0.3 / 9),
          mealType,
          loggedAt: new Date().toISOString(),
          userId: 'local_user',
          servingSize: '1 serving',
        });
        toast.showSuccess(`Logged ${name} (${calNum} kcal)`);
      } else if (type === 'water') {
        const ml = parseInt(waterAmount, 10) || 250;
        await WaterRepository.create({ amount: ml });
        toast.showSuccess(`Added ${ml} ml Water`);
      } else if (type === 'workout') {
        const title = workoutTitle.trim() || 'General Workout';
        const dur = parseInt(duration, 10) || 30;
        const cal = parseInt(workoutCalories, 10) || 150;
        await WorkoutRepository.create({
          title,
          category: 'Fitness',
          durationMinutes: dur,
          caloriesBurned: cal,
          intensity: 'Moderate',
          completedAt: new Date().toISOString(),
          userId: 'local_user',
        });
        toast.showSuccess(`Logged ${title} (${dur} mins)`);
      } else if (type === 'weight') {
        const w = parseFloat(weightKg) || 70;
        await WeightRepository.create({ weightKg: w });
        toast.showSuccess(`Logged Weight ${w} kg`);
      }

      resetFields();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[QuickLogModal] Error saving entry:', err);
      toast.showError('Failed to save log');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'food':
        return '🍽 Add Food Log';
      case 'water':
        return '💧 Add Water Intake';
      case 'workout':
        return '🏋 Log Workout';
      case 'weight':
        return '⚖ Log Current Weight';
      default:
        return 'Quick Log';
    }
  };

  return (
    <FloatingModal visible={visible && !!type} onClose={handleClose} title={getTitle()}>
      <View style={styles.container}>
        {type === 'food' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Meal Category</Text>
            <View style={styles.chipRow}>
              {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMealType(m)}
                  style={[styles.chip, mealType === m && styles.chipActive]}
                >
                  <Text style={[styles.chipText, mealType === m && styles.chipTextActive]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Food Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Chicken Salad & Rice"
              value={foodName}
              onChangeText={setFoodName}
              placeholderTextColor={colors.gray400}
            />

            <View style={styles.row}>
              <View style={[styles.inputHalf, { marginRight: 8 }]}>
                <Text style={styles.label}>Calories (kcal)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="450"
                  keyboardType="numeric"
                  value={calories}
                  onChangeText={setCalories}
                  placeholderTextColor={colors.gray400}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Protein (grams)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="35"
                  keyboardType="numeric"
                  value={protein}
                  onChangeText={setProtein}
                  placeholderTextColor={colors.gray400}
                />
              </View>
            </View>
          </View>
        )}

        {type === 'water' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Quick Amount</Text>
            <View style={styles.waterPresetGrid}>
              {['250', '350', '500', '750'].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  onPress={() => setWaterAmount(amt)}
                  style={[styles.waterPresetBtn, waterAmount === amt && styles.waterPresetActive]}
                >
                  <Text style={[styles.waterPresetText, waterAmount === amt && styles.waterPresetTextActive]}>
                    +{amt} ml
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Custom Amount (ml)</Text>
            <TextInput
              style={styles.input}
              placeholder="250"
              keyboardType="numeric"
              value={waterAmount}
              onChangeText={setWaterAmount}
              placeholderTextColor={colors.gray400}
            />
          </View>
        )}

        {type === 'workout' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Workout Title / Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Upper Body Strength"
              value={workoutTitle}
              onChangeText={setWorkoutTitle}
              placeholderTextColor={colors.gray400}
            />

            <View style={styles.row}>
              <View style={[styles.inputHalf, { marginRight: 8 }]}>
                <Text style={styles.label}>Duration (mins)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="45"
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                  placeholderTextColor={colors.gray400}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.label}>Calories Burned</Text>
                <TextInput
                  style={styles.input}
                  placeholder="300"
                  keyboardType="numeric"
                  value={workoutCalories}
                  onChangeText={setWorkoutCalories}
                  placeholderTextColor={colors.gray400}
                />
              </View>
            </View>
          </View>
        )}

        {type === 'weight' && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Body Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="70.5"
              keyboardType="decimal-pad"
              value={weightKg}
              onChangeText={setWeightKg}
              placeholderTextColor={colors.gray400}
            />
          </View>
        )}

        <View style={styles.actions}>
          <Button variant="secondary" label="Cancel" onPress={handleClose} style={{ flex: 1, marginRight: 8 }} />
          <Button variant="primary" label="Save Log" onPress={handleSubmit} loading={loading} style={{ flex: 1 }} />
        </View>
      </View>
    </FloatingModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.gray900,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputHalf: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.gray100,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  waterPresetGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  waterPresetBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
  },
  waterPresetActive: {
    backgroundColor: colors.secondary,
  },
  waterPresetText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray700,
  },
  waterPresetTextActive: {
    color: '#ffffff',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
});
