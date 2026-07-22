// Gesture Handler Provider
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export interface GestureProviderProps {
  children: React.ReactNode;
}

export const GestureProvider: React.FC<GestureProviderProps> = ({ children }) => {
  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
  });

  return <GestureHandlerRootView style={styles.root}>{children}</GestureHandlerRootView>;
};
