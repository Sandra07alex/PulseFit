import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface LargeTitleProps {
  children: string;
  subtitle?: string;
  style?: TextStyle;
}

export const LargeTitle: React.FC<LargeTitleProps> = ({ children, style }) => {
  const { colors } = useTheme();

  return (
    <Text style={[styles.title, { color: colors.text }, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
});
