import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AnimatedSlider } from '../components/AnimatedSlider';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';

export interface Step5TargetWeightProps {
  unitSystem: 'metric' | 'imperial';
  targetWeightKg: number;
  targetWeightLbs: number;
  onChangeTarget: (value: number) => void;
  onNext: () => void;
}

export const Step5TargetWeight: React.FC<Step5TargetWeightProps> = ({
  unitSystem,
  targetWeightKg,
  targetWeightLbs,
  onChangeTarget,
  onNext,
}) => {
  const isMetric = unitSystem === 'metric';
  const currentValue = isMetric ? targetWeightKg : targetWeightLbs;
  const unit = isMetric ? 'kg' : 'lbs';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set your target weight</Text>
        <Text style={styles.subtitle}>Optional: Choose your dream weight or keep it identical to your current weight.</Text>
      </View>

      <View style={styles.centerContent}>
        <AnimatedSlider
          value={currentValue}
          unit={unit}
          min={isMetric ? 40 : 90}
          max={isMetric ? 180 : 400}
          onChange={onChangeTarget}
        />
      </View>

      <View style={styles.ctaWrapper}>
        <Button label="Continue →" variant="primary" size="lg" fullWidth onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  ctaWrapper: {
    paddingTop: 10,
    paddingBottom: 16,
  },
});
