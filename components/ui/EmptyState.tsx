// EmptyState component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, colors } from '~/theme';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    icon: {
      marginBottom: spacing.lg,
    },
    title: {
      marginBottom: spacing.sm,
      textAlign: 'center',
    },
    description: {
      marginBottom: spacing.lg,
      textAlign: 'center',
    },
    action: {
      marginTop: spacing.lg,
    },
  });

  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text variant="h4" style={styles.title}>
        {title}
      </Text>
      {description && (
        <Text variant="body" color={colors.textSecondary} style={styles.description}>
          {description}
        </Text>
      )}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
};
