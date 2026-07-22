import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { MeasurementInput } from '../components/MeasurementInput';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';

export interface Step3BiometricsProps {
  unitSystem: 'metric' | 'imperial';
  onUnitChange: (unit: 'metric' | 'imperial') => void;
  heightCm: number;
  heightInches: number;
  weightKg: number;
  weightLbs: number;
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  onChange: (field: string, value: any) => void;
  onNext: () => void;
}

export const Step3Biometrics: React.FC<Step3BiometricsProps> = ({
  unitSystem,
  onUnitChange,
  heightCm,
  heightInches,
  weightKg,
  weightLbs,
  age,
  gender,
  onChange,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>We use this to personalize your daily targets and energy calculations.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <MeasurementInput
          unitSystem={unitSystem}
          onUnitChange={onUnitChange}
          heightCm={heightCm}
          heightInches={heightInches}
          weightKg={weightKg}
          weightLbs={weightLbs}
          age={age}
          gender={gender}
          onChange={onChange}
        />
      </ScrollView>

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
  scrollContent: {
    paddingBottom: 16,
  },
  ctaWrapper: {
    paddingTop: 10,
    paddingBottom: 16,
  },
});
