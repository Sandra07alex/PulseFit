// Root Providers Composition
import React from 'react';
import { GestureProvider } from './GestureProvider';
import { SafeAreaProviderWrapper } from './SafeAreaProvider';
import { ThemeProvider } from './ThemeProvider';
import { SupabaseProvider } from './SupabaseProvider';
import { QueryProvider } from './QueryProvider';

export interface RootProvidersProps {
  children: React.ReactNode;
}

export const RootProviders: React.FC<RootProvidersProps> = ({ children }) => {
  return (
    <GestureProvider>
      <SafeAreaProviderWrapper>
        <QueryProvider>
          <SupabaseProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SupabaseProvider>
        </QueryProvider>
      </SafeAreaProviderWrapper>
    </GestureProvider>
  );
};
