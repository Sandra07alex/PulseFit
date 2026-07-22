import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export interface OnboardingProgressIndicatorProps {
  currentStep: number; // 1 to 8
  totalSteps?: number;
  onBack?: () => void;
  showBack?: boolean;
}

export const OnboardingProgressIndicator: React.FC<OnboardingProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 8,
  onBack,
  showBack = true,
}) => {
  const animatedProgress = useRef(new Animated.Value((currentStep / totalSteps) * 100)).current;

  useEffect(() => {
    Animated.spring(animatedProgress, {
      toValue: (currentStep / totalSteps) * 100,
      tension: 140,
      friction: 12,
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps, animatedProgress]);

  const widthPercent = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack && onBack && currentStep > 1 ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderButton} />
        )}

        <Text style={styles.stepText}>
          Step <Text style={styles.stepHighlight}>{currentStep}</Text> of {totalSteps}
        </Text>

        <View style={styles.placeholderButton} />
      </View>

      {/* Animated Progress Bar */}
      <View style={styles.barTrack}>
        <Animated.View style={[styles.barFill, { width: widthPercent }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.gray800,
    fontWeight: '700',
  },
  placeholderButton: {
    width: 36,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
  },
  stepHighlight: {
    color: colors.primary,
    fontWeight: '800',
  },
  barTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.gray200,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
