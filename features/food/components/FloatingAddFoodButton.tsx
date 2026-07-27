/**
 * @file FloatingAddFoodButton.tsx
 * @description Animated floating action button for adding food.
 * Uses Brocco (green) companion accent with bounce animation on press.
 */

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { colors }  from '../../../theme/colors';
import { radius }  from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';

interface FloatingAddFoodButtonProps {
  onPress: () => void;
  label?:  string;
}

export const FloatingAddFoodButton: React.FC<FloatingAddFoodButtonProps> = ({
  onPress,
  label = 'Add Food',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue:         0.90,
      useNativeDriver: true,
      tension:         220,
      friction:        12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue:         1,
      useNativeDriver: true,
      tension:         160,
      friction:        6,
    }).start();
  };

  return (
    <Animated.View
      style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View style={styles.inner}>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.icon}>🥦</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom:   100, // above floating nav
    right:    spacing_lg,
    left:     spacing_lg,
    zIndex:   50,
  },
  button: {
    backgroundColor:  colors.companions.brocco.primary,
    borderRadius:     radius.pill,
    paddingVertical:  16,
    paddingHorizontal: 28,
    ...shadows.button,
  },
  inner: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            10,
  },
  plus: {
    fontSize:   24,
    fontWeight: '800',
    color:      colors.white,
    lineHeight: 26,
  },
  label: {
    fontSize:   17,
    fontWeight: '800',
    color:      colors.white,
    letterSpacing: -0.3,
  },
  icon: {
    fontSize: 20,
  },
});

// Inline constant to avoid spacing import at module level
const spacing_lg = 20;
