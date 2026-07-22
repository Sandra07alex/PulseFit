import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export interface MeasurementInputProps {
  unitSystem: 'metric' | 'imperial';
  onUnitChange: (unit: 'metric' | 'imperial') => void;
  heightCm: number;
  heightInches: number;
  weightKg: number;
  weightLbs: number;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  onChange: (field: string, value: any) => void;
}

export const MeasurementInput: React.FC<MeasurementInputProps> = ({
  unitSystem,
  onUnitChange,
  heightCm,
  heightInches,
  weightKg,
  weightLbs,
  age,
  gender,
  onChange,
}) => {
  const isMetric = unitSystem === 'metric';

  return (
    <View style={styles.container}>
      {/* Unit Switcher */}
      <View style={styles.unitToggleContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onUnitChange('metric')}
          style={[styles.unitButton, isMetric && styles.unitButtonActive]}
        >
          <Text style={[styles.unitText, isMetric && styles.unitTextActive]}>Metric (cm, kg)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onUnitChange('imperial')}
          style={[styles.unitButton, !isMetric && styles.unitButtonActive]}
        >
          <Text style={[styles.unitText, !isMetric && styles.unitTextActive]}>Imperial (in, lbs)</Text>
        </TouchableOpacity>
      </View>

      {/* Height & Weight Row */}
      <View style={styles.row}>
        {/* Height */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Height</Text>
          <View style={styles.inputGroup}>
            <TextInput
              keyboardType="number-pad"
              value={String(isMetric ? heightCm : heightInches)}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                onChange(isMetric ? 'heightCm' : 'heightInches', num);
              }}
              style={styles.inputText}
            />
            <Text style={styles.unitLabel}>{isMetric ? 'cm' : 'in'}</Text>
          </View>
        </View>

        {/* Weight */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Weight</Text>
          <View style={styles.inputGroup}>
            <TextInput
              keyboardType="number-pad"
              value={String(isMetric ? weightKg : weightLbs)}
              onChangeText={(text) => {
                const num = parseInt(text) || 0;
                onChange(isMetric ? 'weightKg' : 'weightLbs', num);
              }}
              style={styles.inputText}
            />
            <Text style={styles.unitLabel}>{isMetric ? 'kg' : 'lbs'}</Text>
          </View>
        </View>
      </View>

      {/* Age */}
      <View style={styles.inputCardFull}>
        <Text style={styles.label}>Age</Text>
        <View style={styles.inputGroup}>
          <TextInput
            keyboardType="number-pad"
            value={String(age)}
            onChangeText={(text) => onChange('age', parseInt(text) || 0)}
            style={styles.inputText}
          />
          <Text style={styles.unitLabel}>years</Text>
        </View>
      </View>

      {/* Gender Selection */}
      <View style={styles.genderContainer}>
        <Text style={styles.label}>Gender</Text>
        <View style={styles.genderRow}>
          {[
            { id: 'male', label: 'Male 👨' },
            { id: 'female', label: 'Female 👩' },
            { id: 'other', label: 'Other 🌈' },
          ].map((g) => {
            const isSelected = gender === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                onPress={() => onChange('gender', g.id)}
                style={[styles.genderChip, isSelected && styles.genderChipSelected]}
              >
                <Text style={[styles.genderChipText, isSelected && styles.genderChipTextSelected]}>
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  unitToggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 8,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  unitButtonActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
  },
  unitTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  inputCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  inputCardFull: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray600,
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  inputText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    minWidth: 60,
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
  },
  genderContainer: {
    marginTop: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderChipSelected: {
    backgroundColor: colors.primary,
  },
  genderChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray700,
  },
  genderChipTextSelected: {
    color: '#FFFFFF',
  },
});
