import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Companion } from '../mascot/Companion';
import { CompanionId } from '../mascot/types';
import { colors } from '../../theme/colors';

export interface LoadingPageProps {
  message?: string;
  companionId?: CompanionId;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Preparing your energy...',
  companionId = 'pulse',
}) => {
  return (
    <View style={styles.container}>
      <Companion id={companionId} mood="idle" size="lg" animated={true} />
      <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray500,
    marginTop: 12,
  },
});
