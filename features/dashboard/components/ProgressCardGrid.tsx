/**
 * @file ProgressCardGrid.tsx
 * @description 2×2 grid of animated progress cards for Today's Progress section.
 * Renders a staggered entrance animation — each card fades + slides in with a delay.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ProgressCard } from './ProgressCard';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import type { MetricProgress } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Single staggered card wrapper
// ---------------------------------------------------------------------------

const StaggeredCard: React.FC<{
  metric: MetricProgress;
  index: number;
  onPress?: () => void;
}> = ({ metric, index, onPress }) => {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const delay = index * 80; // 80ms stagger between cards
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 120,
        friction: 14,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <ProgressCard metric={metric} onPress={onPress} />
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// Grid component
// ---------------------------------------------------------------------------

export interface ProgressCardGridProps {
  metrics: MetricProgress[];
  onCardPress?: (metricId: string) => void;
}

export const ProgressCardGrid: React.FC<ProgressCardGridProps> = ({
  metrics,
  onCardPress,
}) => {
  // Always render 4 slots
  const slots = [0, 1, 2, 3];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {slots.map((slotIndex) => {
          const metric = metrics[slotIndex];
          if (!metric) return <View key={`empty-${slotIndex}`} style={styles.cardWrapper} />;
          return (
            <StaggeredCard
              key={metric.id}
              metric={metric}
              index={slotIndex}
              onPress={onCardPress ? () => onCardPress(metric.id) : undefined}
            />
          );
        })}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  cardWrapper: {
    width: '47%', // ~half width with gap
    // Each card fills its own flex space
  },
});
