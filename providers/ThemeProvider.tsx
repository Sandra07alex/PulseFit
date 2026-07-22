// Theme Provider
import React, { createContext, useContext, useMemo } from 'react';
import { theme } from '~/theme';
import { useColorScheme } from '~/hooks';

interface ThemeContextValue {
  theme: typeof theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const value = useMemo(
    () => ({
      theme,
      isDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};
