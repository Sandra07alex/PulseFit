import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { OnboardingGoalCard } from '../components/OnboardingGoalCard';
import { Button } from '../../../components/ui/Button';
import { GoalOption } from '../../../store/onboardingStore';
import { colors } from '../../../theme/colors';

export interface Step2GoalProps {
  selectedGoal: GoalOption;
  onSelectGoal: (goal: GoalOption) => void;
  onNext: () => void;
}

const GOALS: { id: GoalOption; title: string; subtitle: string; icon: string; color: string }[] = [
  { id: 'lose_fat', title: 'Lose Fat', subtitle: 'Burn calories & shed body fat', icon: '🔥', color: colors.companions.blaze.primary },
  { id: 'build_muscle', title: 'Build Muscle', subtitle: 'Gain strength & lean muscle mass', icon: '🥩', color: colors.companions.eggsy.primary },
  { id: 'stay_healthy', title: 'Stay Healthy', subtitle: 'Maintain energy & daily balance', icon: '🥦', color: colors.companions.brocco.primary },
  { id: 'improve_fitness', title: 'Improve Fitness', subtitle: 'Boost daily vitality & agility', icon: '⚡', color: colors.primary },
  { id: 'increase_endurance', title: 'Increase Endurance', subtitle: 'Supercharge stamina & cardio capacity', icon: '💧', color: colors.companions.droppy.primary },
];

export const Step2Goal: React.FC<Step2GoalProps> = ({ selectedGoal, onSelectGoal, onNext }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your primary goal?</Text>
        <Text style={styles.subtitle}>Select the focus that matters most to your journey today.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {GOALS.map((g) => (
          <OnboardingGoalCard
            key={g.id}
            id={g.id}
            title={g.title}
            subtitle={g.subtitle}
            icon={g.icon}
            accentColor={g.color}
            selected={selectedGoal === g.id}
            onSelect={() => onSelectGoal(g.id)}
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
    marginBottom: 16,
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
