// Theme store
import { create } from 'zustand';
import { ColorSchemeName } from 'react-native';

interface ThemeStore {
  colorScheme: ColorSchemeName;
  isDark: boolean;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
  toggleDarkMode: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  colorScheme: 'light',
  isDark: false,

  setColorScheme: (colorScheme) =>
    set({
      colorScheme,
      isDark: colorScheme === 'dark',
    }),

  toggleDarkMode: () =>
    set((state) => ({
      isDark: !state.isDark,
      colorScheme: state.isDark ? 'light' : 'dark',
    })),
}));
