import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Companion } from '../mascot/Companion';
import { CompanionId } from '../mascot/types';
import { colors } from '../../theme/colors';

export interface LoadingProps {
  message?: string;
  companionId?: CompanionId;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading your energy...',
  companionId = 'pulse',
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <Companion id={companionId} mood="idle" size="md" animated={true} />
      <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 14 }} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
    marginTop: 8,
  },
});
