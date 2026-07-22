import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Companion } from '../../../components/mascot/Companion';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export interface Step1WelcomeProps {
  onNext: () => void;
}

export const Step1Welcome: React.FC<Step1WelcomeProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.mascotWrapper}>
          <Companion id="pulse" mood="wave" size="xl" animated={true} />
        </View>

        <View style={styles.greetingBadge}>
          <Text style={styles.greetingText}>Welcome to PulseFit! 👋</Text>
        </View>

        <Text style={styles.title}>Meet Your Personal Health Companion</Text>

        <Text style={styles.subtitle}>
          PulseFit brings gamified fitness, hydration tracking, clean nutrition, and daily coach guidance into one soft, motivational experience.
        </Text>
      </View>

      <View style={styles.ctaWrapper}>
        <Button label="Let's Begin 🚀" variant="primary" size="lg" fullWidth onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: 10,
  },
  mascotWrapper: {
    marginBottom: 20,
  },
  greetingBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  ctaWrapper: {
    width: '100%',
  },
});
