import React from 'react';
import { SafeAreaProvider } from './SafeAreaProvider';
import { GestureProvider } from './GestureProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { BottomSheetProvider } from './BottomSheetProvider';

export interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider - Root application provider composing all essential infrastructure providers.
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <GestureProvider>
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              <BottomSheetProvider>{children}</BottomSheetProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </GestureProvider>
    </SafeAreaProvider>
  );
};
