import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export interface AnimatedSliderProps {
  value: number;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (newValue: number) => void;
}

export const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  value,
  unit,
  min = 40,
  max = 140,
  step = 1,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.valueDisplay}>
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.unitText}>{unit}</Text>
      </View>

      {/* Quick Adjustment Stepper */}
      <View style={styles.stepperRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange(Math.max(min, value - step * 5))}
          style={styles.stepBtn}
        >
          <Text style={styles.stepBtnText}>- 5</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange(Math.max(min, value - step))}
          style={styles.stepBtn}
        >
          <Text style={styles.stepBtnText}>- 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange(Math.min(max, value + step))}
          style={styles.stepBtn}
        >
          <Text style={styles.stepBtnText}>+ 1</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onChange(Math.min(max, value + step * 5))}
          style={styles.stepBtn}
        >
          <Text style={styles.stepBtnText}>+ 5</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>Tip: Set your desired weight target or leave it optional.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: radius.card,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  valueDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 20,
  },
  valueText: {
    fontSize: 54,
    fontWeight: '800',
    color: colors.primary,
  },
  unitText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray500,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  stepBtn: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  stepBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  hint: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
  },
});
