import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sphere } from '../../../components/clay/Sphere';
import { clayTints } from '../../../theme/clay';

const t = clayTints.droppy;

/** Glass jar that fills with glossy water as the day's percentage rises */
export const WaterJar: React.FC<{ percentage: number; width?: number; height?: number }> = ({
  percentage,
  width = 116,
  height = 180,
}) => {
  const fill = useRef(new Animated.Value(0)).current;
  const slosh = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fill, {
      toValue: Math.max(0, Math.min(100, percentage)),
      tension: 40,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [percentage, fill]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(slosh, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(slosh, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [slosh]);

  const inner = height - 16;
  const waterHeight = fill.interpolate({ inputRange: [0, 100], outputRange: [0, inner] });
  const waveX = slosh.interpolate({ inputRange: [0, 1], outputRange: [-10, 10] });
  const bubbleY = slosh.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <View style={{ width, alignItems: 'center' }}>
      {/* lid */}
      <View style={[styles.lid, { width: width * 0.62 }]}>
        <LinearGradient colors={clayTints.pulse.face} style={styles.lidFace} />
      </View>
      {/* glass */}
      <View style={[styles.glass, { width, height }]}>
        <Animated.View style={[styles.water, { height: waterHeight }]}>
          <LinearGradient colors={t.face} style={StyleSheet.absoluteFill} />
          {/* wave crest */}
          <Animated.View style={[styles.crest, { transform: [{ translateX: waveX }] }]} />
          <Animated.View style={[styles.bubble, { left: '22%', bottom: '30%', transform: [{ translateY: bubbleY }] }]}>
            <Sphere size={14} color="#FFFFFF" opacity={0.7} />
          </Animated.View>
          <Animated.View style={[styles.bubble, { left: '60%', bottom: '55%', transform: [{ translateY: bubbleY }] }]}>
            <Sphere size={9} color="#FFFFFF" opacity={0.6} />
          </Animated.View>
        </Animated.View>
        {/* glass shine */}
        <View style={[styles.shine, { height: height * 0.62 }]} />
        <View style={[styles.shineDot, { top: height * 0.7 }]} />
      </View>
      {/* base shadow */}
      <View style={[styles.base, { width: width * 0.8 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  lid: {
    height: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
    marginBottom: -3,
    zIndex: 2,
    backgroundColor: clayTints.pulse.lip,
    paddingBottom: 3,
  },
  lidFace: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  glass: {
    borderRadius: 30,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: 'rgba(226, 246, 255, 0.75)',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.95)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 4,
    shadowColor: t.glow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  water: {
    borderRadius: 24,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  crest: {
    position: 'absolute',
    top: -6,
    left: -20,
    right: -20,
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  bubble: {
    position: 'absolute',
  },
  shine: {
    position: 'absolute',
    top: 14,
    left: 10,
    width: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  shineDot: {
    position: 'absolute',
    left: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  base: {
    height: 10,
    marginTop: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(46, 35, 80, 0.1)',
  },
});
