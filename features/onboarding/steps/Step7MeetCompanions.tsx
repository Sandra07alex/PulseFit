import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CompanionIntroCard } from '../components/CompanionIntroCard';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';

export interface Step7MeetCompanionsProps {
  onNext: () => void;
}

export const Step7MeetCompanions: React.FC<Step7MeetCompanionsProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meet Your Coach & Companions</Text>
        <Text style={styles.subtitle}>Each mascot guide celebrates your wins inside their specific domain!</Text>
      </View>

      <View style={styles.contentFlex}>
        <CompanionIntroCard />
      </View>

      <View style={styles.ctaWrapper}>
        <Button label="I'm Ready! 🎉" variant="primary" size="lg" fullWidth onPress={onNext} />
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
    marginBottom: 12,
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
  contentFlex: {
    flex: 1,
  },
  ctaWrapper: {
    paddingTop: 10,
    paddingBottom: 16,
  },
});
