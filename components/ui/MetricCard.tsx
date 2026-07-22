// MetricCard component
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { Text } from './Text';
import { spacing, colors } from '~/theme';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number | string;
  color?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  trendValue,
  color = colors.primary,
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    title: {
      marginBottom: spacing.xs,
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trend: {
      marginLeft: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 4,
      backgroundColor: colors.gray100,
    },
  });

  const trendColor =
    trend === 'up' ? colors.success : trend === 'down' ? colors.error : colors.textSecondary;

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="caption" color={colors.textSecondary} style={styles.title}>
            {title}
          </Text>
          <View style={styles.valueContainer}>
            <Text variant="h3" color={color}>
              {value}
            </Text>
            {unit && (
              <Text variant="body" color={colors.textSecondary}>
                {' '}
                {unit}
              </Text>
            )}
            {trendValue && (
              <View style={styles.trend}>
                <Text variant="caption" color={trendColor}>
                  {trendValue}
                </Text>
              </View>
            )}
          </View>
        </View>
        {icon && <View>{icon}</View>}
      </View>
    </Card>
  );
};
