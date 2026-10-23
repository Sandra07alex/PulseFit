import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sphere } from './Sphere';
import { clay } from '../../theme/clay';

interface BubbleSpec {
  size: number;
  top: `${number}%`;
  left: `${number}%`;
  color: string;
  duration: number;
  drift: number;
}

const BUBBLES: BubbleSpec[] = [
  { size: 150, top: '-4%', left: '62%', color: clay.bubbles[0], duration: 6200, drift: 14 },
  { size: 70, top: '18%', left: '-6%', color: clay.bubbles[1], duration: 5200, drift: 10 },
  { size: 46, top: '44%', left: '84%', color: clay.bubbles[2], duration: 4600, drift: 12 },
  { size: 110, top: '70%', left: '-10%', color: clay.bubbles[3], duration: 7000, drift: 16 },
  { size: 58, top: '86%', left: '72%', color: clay.bubbles[4], duration: 5600, drift: 10 },
];

const FloatingBubble: React.FC<{ spec: BubbleSpec; index: number }> = ({ spec, index }) => {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, {
          toValue: 1,
          duration: spec.duration,
          delay: index * 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: spec.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t, spec.duration, index]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -spec.drift] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', index % 2 ? '8deg' : '-8deg'] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: spec.top,
        left: spec.left,
        transform: [{ translateY }, { rotate }],
      }}
    >
      <Sphere size={spec.size} color={spec.color} opacity={0.55} />
    </Animated.View>
  );
};

export interface ClayBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Hide the floating bubbles (e.g. on dense list screens) */
  bubbles?: boolean;
}

/** Pastel gradient backdrop with slowly floating glossy bubbles */
export const ClayBackground: React.FC<ClayBackgroundProps> = ({ children, style, bubbles = true }) => (
  <View style={[styles.root, style]}>
    <LinearGradient
      colors={clay.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {bubbles && (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {BUBBLES.map((b, i) => (
          <FloatingBubble key={i} spec={b} index={i} />
        ))}
      </View>
    )}
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: clay.background[0],
    overflow: 'hidden',
  },
});
