import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface LinearProgressProps {
  progress: number; // 0 - 100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
  style?: ViewStyle;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  progress,
  height = 12,
  color = colors.primary,
  backgroundColor = colors.gray100,
  showPercentage = false,
  label,
  style,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: Math.min(100, Math.max(0, progress)),
      tension: 100,
      friction: 12,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const widthPercent = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={style}>
      {(label || showPercentage) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.labelText}>{label}</Text>}
          {showPercentage && <Text style={styles.percentText}>{Math.round(progress)}%</Text>}
        </View>
      )}

      <View style={[styles.track, { height, backgroundColor, borderRadius: radius.pill }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthPercent,
              backgroundColor: color,
              borderRadius: radius.pill,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray700,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray900,
  },
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
