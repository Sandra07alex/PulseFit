import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { clay } from '../../theme/clay';

export interface ClayBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/** Plain cream backdrop – kept simple so mascots and cards stand out */
export const ClayBackground: React.FC<ClayBackgroundProps> = ({ children, style }) => (
  <View style={[styles.root, style]}>{children}</View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: clay.background,
  },
});
