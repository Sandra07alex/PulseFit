import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  color?: string;
  label?: string;
  unit?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max,
  size = 100,
  color = colors.primary,
  label,
  unit,
}) => {
  const percentage = (value / max) * 100;

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: size / 2,
      backgroundColor: colors.gray100,
    },
    content: {
      alignItems: 'center',
    },
    value: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.content}>
        <View style={styles.value}>
          <Text variant="h4">{value}</Text>
          {unit && (
            <Text variant="body" color={colors.textSecondary}>
              {' '}{unit}
            </Text>
          )}
        </View>
        {label && (
          <Text variant="caption" color={colors.textSecondary}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
};
