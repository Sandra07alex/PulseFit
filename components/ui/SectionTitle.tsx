// SectionTitle component
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, colors } from '~/theme';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, action }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    content: {
      flex: 1,
    },
    title: {
      marginBottom: subtitle ? spacing.xs : 0,
    },
    action: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="h4" style={styles.title}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="caption" color={colors.textSecondary}>
            {subtitle}
          </Text>
        )}
      </View>
      {action && (
        <Pressable style={styles.action} onPress={action.onPress}>
          <Text variant="label" color={colors.primary}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );
};
