import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { animations } from '../theme/animations';

/**
 * Custom hook for button press compression effect (scale down on press down, restore on release)
 */
export function usePressAnimation(pressedScale: number = animations.micro.buttonPressScale) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: pressedScale,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 180,
      friction: 8,
    }).start();
  };

  return { scale, handlePressIn, handlePressOut };
}

/**
 * Custom hook for continuous mascot breathing idle animation (gentle pulsing scale)
 */
export function useBreathingAnimation(active: boolean = true) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) return;

    const breathingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: animations.micro.mascotBreathingScaleMax,
          duration: animations.durations.breathing / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: animations.micro.mascotBreathingScaleMin,
          duration: animations.durations.breathing / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    breathingLoop.start();
    return () => breathingLoop.stop();
  }, [active, scale]);

  return scale;
}

/**
 * Custom hook for card lift elevation micro-interaction on touch
 */
export function useCardLiftAnimation() {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handleTouchStart = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: animations.micro.cardTouchScale,
        useNativeDriver: true,
        tension: 220,
        friction: 14,
      }),
      Animated.spring(translateY, {
        toValue: animations.micro.cardLiftTranslateY,
        useNativeDriver: true,
        tension: 200,
        friction: 12,
      }),
    ]).start();
  };

  const handleTouchEnd = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 180,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 180,
        friction: 8,
      }),
    ]).start();
  };

  return { scale, translateY, handleTouchStart, handleTouchEnd };
}

/**
 * Custom hook for smooth numerical counter increment micro-interaction
 */
export function useCounterAnimation(targetValue: number, duration: number = 800) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: targetValue,
      duration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [targetValue, duration, animatedValue]);

  return animatedValue;
}
