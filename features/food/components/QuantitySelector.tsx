/**
 * @file QuantitySelector.tsx
 * @description Quantity input with unit selector. Live nutrition recalculation on change.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import { SERVING_UNITS } from '../types/food.types';
import type { ServingUnit } from '../types/food.types';

interface QuantitySelectorProps {
  quantity:         number;
  unit:             ServingUnit;
  onQuantityChange: (qty: number) => void;
  onUnitChange:     (unit: ServingUnit) => void;
  defaultServingSize: number;
  defaultUnit:      ServingUnit;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  unit,
  onQuantityChange,
  onUnitChange,
  defaultServingSize,
  defaultUnit,
}) => {
  const [rawInput, setRawInput] = useState(String(quantity));

  const handleInput = useCallback(
    (text: string) => {
      setRawInput(text);
      const parsed = parseFloat(text);
      if (!isNaN(parsed) && parsed > 0) {
        onQuantityChange(parsed);
      }
    },
    [onQuantityChange]
  );

  const adjust = (delta: number) => {
    const next = Math.max(1, quantity + delta);
    setRawInput(String(next));
    onQuantityChange(next);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantity</Text>

      {/* Amount input row */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.stepper}
          onPress={() => adjust(-10)}
          accessibilityLabel="Decrease by 10"
        >
          <Text style={styles.stepperText}>−−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepper}
          onPress={() => adjust(-1)}
          accessibilityLabel="Decrease by 1"
        >
          <Text style={styles.stepperText}>−</Text>
        </TouchableOpacity>

        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={rawInput}
            onChangeText={handleInput}
            keyboardType="decimal-pad"
            selectTextOnFocus
            accessibilityLabel="Quantity input"
          />
          <Text style={styles.unitLabel}>{unit}</Text>
        </View>

        <TouchableOpacity
          style={styles.stepper}
          onPress={() => adjust(1)}
          accessibilityLabel="Increase by 1"
        >
          <Text style={styles.stepperText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.stepper}
          onPress={() => adjust(10)}
          accessibilityLabel="Increase by 10"
        >
          <Text style={styles.stepperText}>++</Text>
        </TouchableOpacity>
      </View>

      {/* Reset to default serving */}
      <TouchableOpacity
        onPress={() => {
          setRawInput(String(defaultServingSize));
          onQuantityChange(defaultServingSize);
          onUnitChange(defaultUnit);
        }}
        style={styles.resetBtn}
        accessibilityLabel={`Reset to default serving: ${defaultServingSize}${defaultUnit}`}
      >
        <Text style={styles.resetText}>
          Reset to default ({defaultServingSize}{defaultUnit})
        </Text>
      </TouchableOpacity>

      {/* Unit selector */}
      <Text style={[styles.label, { marginTop: spacing.md }]}>Unit</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.unitList}
      >
        {SERVING_UNITS.map(({ value, label }) => (
          <TouchableOpacity
            key={value}
            style={[styles.unitChip, unit === value && styles.unitChipActive]}
            onPress={() => onUnitChange(value)}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: unit === value }}
          >
            <Text style={[styles.unitChipText, unit === value && styles.unitChipTextActive]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.lightMode.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  stepper: {
    backgroundColor: colors.primarySoft,
    borderRadius:    radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
  },
  stepperText: {
    fontSize:  typography.sizes.base,
    fontWeight: '800',
    color:     colors.primary,
  },
  inputWrap: {
    flex:           1,
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: colors.lightMode.surface,
    borderRadius:   radius.input,
    borderWidth:    2,
    borderColor:    colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.sm,
    gap:            spacing.sm,
    ...shadows.sm,
  },
  input: {
    flex:     1,
    fontSize: typography.sizes['2xl'],
    fontWeight: '800',
    color:    colors.lightMode.text,
    textAlign: 'center',
    letterSpacing: -0.5,
    padding:  0,
  },
  unitLabel: {
    fontSize:  typography.sizes.base,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
  },
  resetBtn: {
    alignSelf: 'center',
  },
  resetText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '600',
    color:     colors.lightMode.textTertiary,
    textDecorationLine: 'underline',
  },
  unitList: {
    gap:           spacing.sm,
    flexDirection: 'row',
  },
  unitChip: {
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
    borderRadius:      radius.pill,
    borderWidth:       1.5,
    borderColor:       colors.lightMode.border,
    backgroundColor:   colors.lightMode.surface,
  },
  unitChipActive: {
    backgroundColor: colors.primary,
    borderColor:     colors.primary,
  },
  unitChipText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.lightMode.textSecondary,
  },
  unitChipTextActive: {
    color: colors.white,
  },
});
