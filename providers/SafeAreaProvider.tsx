// Safe Area Provider
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export interface SafeAreaProviderWrapperProps {
  children: React.ReactNode;
}

export const SafeAreaProviderWrapper: React.FC<SafeAreaProviderWrapperProps> = ({
  children,
}) => {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
};
