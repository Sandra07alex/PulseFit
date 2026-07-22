// useColorScheme hook
import { useColorScheme as useColorSchemeNative } from 'react-native';
import { useThemeStore } from '~/store';

export const useColorScheme = () => {
  const colorScheme = useColorSchemeNative();
  const themeColorScheme = useThemeStore((state) => state.colorScheme);

  return themeColorScheme || colorScheme || 'light';
};
