import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { CompanionId } from '../mascot/types';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface AchievementCardProps {
  badgeName: string;
  description: string;
  unlockedDate?: string;
  companionId?: CompanionId;
  style?: ViewStyle;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  badgeName,
  description,
  unlockedDate = 'Unlocked Today!',
  companionId = 'pulse',
  style,
}) => {
  return (
    <Card variant="hero" style={style}>
      <View style={styles.container}>
        <View style={styles.mascotWrapper}>
          <Companion id={companionId} mood="celebrate" size="lg" animated={true} />
        </View>

        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedText}>🏆 {unlockedDate}</Text>
        </View>

        <Text style={styles.badgeName}>{badgeName}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 8,
  },
  mascotWrapper: {
    marginBottom: 10,
  },
  unlockedBadge: {
    backgroundColor: colors.companions.eggsy.soft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: 8,
  },
  unlockedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.companions.eggsy.primary,
  },
  badgeName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.gray600,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
