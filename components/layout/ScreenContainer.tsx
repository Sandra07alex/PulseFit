import React from 'react';
import { View, StyleSheet, StatusBar as RNStatusBar, ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../hooks/useTheme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
  const { isDark, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
