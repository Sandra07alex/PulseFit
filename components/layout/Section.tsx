import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../../theme/spacing';

export interface SectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Section: React.FC<SectionProps> = ({ children, style }) => {
  return <View style={[styles.section, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.xl,
  },
});
