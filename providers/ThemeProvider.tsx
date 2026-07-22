import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { StorageService } from '../services/StorageService';
import { StorageKeys } from '../constants/StorageKeys';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useRNColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    StorageService.getItem<ThemeMode>(StorageKeys.THEME_MODE).then((savedMode) => {
      if (savedMode) setModeState(savedMode);
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    StorageService.setItem<ThemeMode>(StorageKeys.THEME_MODE, newMode);
  };

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isDark,
    }),
    [mode, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
