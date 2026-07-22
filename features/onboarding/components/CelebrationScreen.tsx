import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { Companion } from '../../../components/mascot/Companion';
import { Button } from '../../../components/ui/Button';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

export interface CelebrationScreenProps {
  onStartJourney: () => void;
}

export const CelebrationScreen: React.FC<CelebrationScreenProps> = ({ onStartJourney }) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return (
    <View style={styles.container}>
      {/* Sparkles / Confetti Burst Header */}
      <Animated.View style={[styles.celebrationCircle, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
        <Companion id="pulse" mood="celebrate" size="xl" animated={true} />
      </Animated.View>

      <View style={styles.textGroup}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎉 You're All Set!</Text>
        </View>

        <Text style={styles.title}>Your Journey Begins Now!</Text>
        <Text style={styles.subtitle}>
          ❤️ Pulse coach and the companion family are hyped to guide your health transformation every day.
        </Text>
      </View>

      <View style={styles.ctaWrapper}>
        <Button
          label="Start My Journey 🚀"
          variant="primary"
          size="lg"
          fullWidth
          onPress={onStartJourney}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  celebrationCircle: {
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textGroup: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: 32,
  },
  badge: {
    backgroundColor: colors.companions.eggsy.soft,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.companions.eggsy.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  ctaWrapper: {
    width: '100%',
  },
});
