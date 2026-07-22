// Loading component
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, colors } from '~/theme';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = colors.primary,
  message,
  fullScreen = false,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: fullScreen ? 1 : undefined,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    spinner: {
      marginBottom: spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} style={styles.spinner} />
      {message && (
        <Text variant="body" color={colors.textSecondary}>
          {message}
        </Text>
      )}
    </View>
  );
};
