import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';
import { clay } from '../../theme/clay';

/** Faint staggered polka dots, tiled across the whole screen */
const DotPattern: React.FC = () => {
  const { color, spacing, radius } = clay.dots;
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <Pattern id="clayDots" width={spacing * 2} height={spacing * 2} patternUnits="userSpaceOnUse">
          <Circle cx={spacing / 2} cy={spacing / 2} r={radius} fill={color} />
          <Circle cx={spacing * 1.5} cy={spacing * 1.5} r={radius} fill={color} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#clayDots)" />
    </Svg>
  );
};

export interface ClayBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Show the polka-dot pattern (on by default) */
  pattern?: boolean;
}

/** Cozy cream backdrop with a subtle polka-dot pattern */
export const ClayBackground: React.FC<ClayBackgroundProps> = ({ children, style, pattern = true }) => (
  <View style={[styles.root, style]}>
    <LinearGradient
      colors={clay.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.4, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    {pattern && <DotPattern />}
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
