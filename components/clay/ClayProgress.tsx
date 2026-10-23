import React, { useEffect, useId, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { clay, clayTints, ClayTint } from '../../theme/clay';

// ---------------------------------------------------------------------------
// ClayProgressBar – an inset tube with a glossy jelly fill
// ---------------------------------------------------------------------------

export interface ClayProgressBarProps {
  /** 0–100 */
  percentage: number;
  tint?: ClayTint;
  height?: number;
}

export const ClayProgressBar: React.FC<ClayProgressBarProps> = ({
  percentage,
  tint = 'pulse',
  height = 16,
}) => {
  const t = clayTints[tint];
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: Math.max(0, Math.min(100, percentage)),
      tension: 60,
      friction: 10,
      useNativeDriver: false,
    }).start();
  }, [percentage, anim]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.track, { height, backgroundColor: t.soft }]}>
      {/* inner shadow along the top of the groove */}
      <View style={[styles.trackInset, { height: height / 2 }]} />
      <Animated.View style={[styles.fillWrap, { width, minWidth: percentage > 0 ? height : 0 }]}>
        <LinearGradient colors={t.face} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.fill}>
          <View style={[styles.fillGloss, { height: height * 0.32, top: height * 0.16 }]} />
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// ClayRing – thick rounded ring with a raised, glossy arc
// ---------------------------------------------------------------------------

export interface ClayRingProps {
  percentage: number;
  size?: number;
  stroke?: number;
  tint?: ClayTint;
  children?: React.ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const ClayRing: React.FC<ClayRingProps> = ({
  percentage,
  size = 120,
  stroke = 16,
  tint = 'pulse',
  children,
}) => {
  const t = clayTints[tint];
  const id = `ring${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const r = (size - stroke) / 2 - 2;
  const c = 2 * Math.PI * r;
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: Math.max(0, Math.min(100, percentage)),
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [percentage, anim]);

  const dashOffset = anim.interpolate({ inputRange: [0, 100], outputRange: [c, 0] });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={t.face[0]} />
            <Stop offset="100%" stopColor={t.lip} />
          </SvgGradient>
        </Defs>
        {/* groove */}
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={t.soft} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2 + 1.5}
          r={r}
          stroke={clay.inset}
          strokeWidth={stroke - 6}
          fill="none"
        />
        {/* raised arc: shadow, body, gloss */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2 + 2}
          r={r}
          stroke={t.lip}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2 + 2})`}
          opacity={0.6}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r - stroke * 0.22}
          stroke="#FFFFFF"
          strokeOpacity={0.45}
          strokeWidth={stroke * 0.22}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  trackInset: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: clay.inset,
  },
  fillWrap: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    borderRadius: 999,
  },
  fillGloss: {
    position: 'absolute',
    left: 6,
    right: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
});
