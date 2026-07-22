import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ReminderPicker } from '../components/ReminderPicker';
import { Button } from '../../../components/ui/Button';
import { ReminderOption } from '../../../store/onboardingStore';
import { colors } from '../../../theme/colors';

export interface Step6ReminderProps {
  selectedPreset: ReminderOption;
  timeString: string;
  onSelectReminder: (preset: ReminderOption, time: string) => void;
  onNext: () => void;
}

export const Step6Reminder: React.FC<Step6ReminderProps> = ({
  selectedPreset,
  timeString,
  onSelectReminder,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Reminder</Text>
        <Text style={styles.subtitle}>Choose when ❤️ Pulse coach should nudge you for water and daily check-ins.</Text>
      </View>

      <ReminderPicker
        selectedPreset={selectedPreset}
        timeString={timeString}
        onSelectPreset={onSelectReminder}
      />

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
  ctaWrapper: {
    paddingTop: 10,
    paddingBottom: 16,
  },
});
