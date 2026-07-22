// ProgressRing component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors, spacing } from '~/theme';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = colors.primary,
  backgroundColor = colors.gray200,
  label,
}) => {
  const circumference = 2 * Math.PI * ((size - strokeWidth) / 2);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.content, { width: size, height: size }]}>
        <Text variant="h4">{progress}%</Text>
        {label && (
          <Text variant="caption" color={colors.textSecondary}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
};
