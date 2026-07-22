import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Companion } from '../mascot/Companion';
import { CompanionId, CompanionMood } from '../mascot/types';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface EmptyPageProps {
  title: string;
  subtitle?: string;
  companionId?: CompanionId;
  companionMood?: CompanionMood;
  greeting?: string;
  style?: ViewStyle;
}

export const EmptyPage: React.FC<EmptyPageProps> = ({
  title,
  subtitle,
  companionId = 'pulse',
  companionMood = 'wave',
  greeting = 'Welcome!',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mascotWrapper}>
        <Companion id={companionId} mood={companionMood} size="lg" animated={true} />
      </View>

      {greeting && (
        <View style={styles.greetingBadge}>
          <Text style={styles.greetingText}>{greeting}</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={styles.comingSoonBadge}>
        <Text style={styles.comingSoonText}>✨ Coming Soon ✨</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  mascotWrapper: {
    marginBottom: 16,
  },
  greetingBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  comingSoonBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  comingSoonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray600,
  },
});
