import React from 'react';
import { ViewStyle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ClayBackground } from '../clay/ClayBackground';

export interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
  return (
    <ClayBackground style={style}>
      <StatusBar style="dark" />
      {children}
    </ClayBackground>
  );
};
