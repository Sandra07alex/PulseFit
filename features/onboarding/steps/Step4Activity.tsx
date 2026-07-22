import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { OnboardingActivityCard } from '../components/OnboardingActivityCard';
import { Button } from '../../../components/ui/Button';
import { ActivityLevelOption } from '../../../store/onboardingStore';
import { colors } from '../../../theme/colors';

export interface Step4ActivityProps {
  selectedActivity: ActivityLevelOption;
  onSelectActivity: (activity: ActivityLevelOption) => void;
  onNext: () => void;
}

const ACTIVITIES: { id: ActivityLevelOption; title: string; description: string; icon: string; multiplier: string }[] = [
  { id: 'sedentary', title: 'Sedentary', description: 'Little to no exercise, desk job or minimal movement', icon: '🛋️', multiplier: '1.2x MET' },
  { id: 'lightly_active', title: 'Lightly Active', description: 'Light exercise 1-3 days per week or active walking', icon: '🚶‍♂️', multiplier: '1.375x MET' },
  { id: 'moderately_active', title: 'Moderately Active', description: 'Moderate workout 3-5 days per week or active job', icon: '🏃‍♂️', multiplier: '1.55x MET' },
  { id: 'very_active', title: 'Very Active', description: 'Hard workouts 6-7 days per week or intense daily activity', icon: '🏋️‍♂️', multiplier: '1.725x MET' },
  { id: 'athlete', title: 'Athlete', description: 'Professional training, double sessions or physical labor', icon: '⚡', multiplier: '1.9x MET' },
];

export const Step4Activity: React.FC<Step4ActivityProps> = ({
  selectedActivity,
  onSelectActivity,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your activity level?</Text>
        <Text style={styles.subtitle}>Helps 🔥 Blaze calculate your baseline caloric expenditure.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {ACTIVITIES.map((a) => (
          <OnboardingActivityCard
            key={a.id}
            title={a.title}
            description={a.description}
            icon={a.icon}
            multiplierText={a.multiplier}
            selected={selectedActivity === a.id}
            onSelect={() => onSelectActivity(a.id)}
          />
        ))}
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
