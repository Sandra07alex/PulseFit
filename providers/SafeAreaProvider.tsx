import React from 'react';
import { SafeAreaProvider as RNSafeAreaProvider } from 'react-native-safe-area-context';

export interface SafeAreaProviderProps {
  children: React.ReactNode;
}

export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  return <RNSafeAreaProvider>{children}</RNSafeAreaProvider>;
};

export const SafeAreaProviderWrapper = SafeAreaProvider;
