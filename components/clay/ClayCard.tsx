import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { clay, clayShadow, clayTints, ClayTint } from '../../theme/clay';
import { useHaptics } from '../../hooks/useHaptics';

export type ClayDepth = keyof typeof clay.depth;

export interface ClayCardProps {
  children?: React.ReactNode;
  tint?: ClayTint;
  depth?: ClayDepth;
  radius?: number;
  padding?: number;
  glow?: 'none' | 'soft' | 'medium' | 'strong';
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  /** Outer wrapper style (margins, flex, width) */
  style?: StyleProp<ViewStyle>;
  /** Face style (layout of children) */
  contentStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

/**
 * ClayCard – a chunky, top-lit 3D surface.
 *
 * The face sits on a darker "lip" that gives it thickness. When pressable,
 * the face sinks into the lip like a soft toy button.
 */
export const ClayCard: React.FC<ClayCardProps> = ({
  children,
  tint = 'cloud',
  depth = 'md',
  radius = 26,
  padding = 18,
  glow = 'medium',
  onPress,
  onLongPress,
  disabled,
  style,
  contentStyle,
  accessibilityLabel,
}) => {
  const t = clayTints[tint];
  const lip = clay.depth[depth];
  const sink = useRef(new Animated.Value(0)).current;
  const haptics = useHaptics();

  const pressTo = (v: number) =>
    Animated.spring(sink, {
      toValue: v,
      useNativeDriver: true,
      tension: 260,
      friction: v ? 18 : 9,
    }).start();

  const translateY = sink.interpolate({ inputRange: [0, 1], outputRange: [0, lip * 0.75] });

  const face = (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <LinearGradient
        colors={t.face}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[styles.face, { borderRadius: radius, padding }, contentStyle]}
      >
        {/* Glossy top highlight */}
        <LinearGradient
          pointerEvents="none"
          colors={[tint === 'cloud' ? clay.glossSoft : clay.gloss, 'rgba(255,255,255,0)']}
          style={[
            styles.gloss,
            { borderTopLeftRadius: radius, borderTopRightRadius: radius },
          ]}
        />
        {children}
      </LinearGradient>
    </Animated.View>
  );

  const body = (
    <View style={{ paddingBottom: lip }}>
      {lip > 0 && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { top: lip, borderRadius: radius, backgroundColor: t.lip },
            glow !== 'none' && clayShadow(tint, glow),
          ]}
        />
      )}
      {lip === 0 && glow !== 'none' && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            { borderRadius: radius, backgroundColor: t.face[1] },
            clayShadow(tint, glow),
          ]}
        />
      )}
      {face}
    </View>
  );

  if (!onPress && !onLongPress) {
    return <View style={style}>{body}</View>;
  }

  return (
    <Pressable
      style={style}
      onPress={() => {
        haptics.light();
        onPress?.();
      }}
      onLongPress={onLongPress}
      onPressIn={() => pressTo(1)}
      onPressOut={() => pressTo(0)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !!disabled }}
    >
      {body}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  face: {
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: clay.innerEdge,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
  },
});
