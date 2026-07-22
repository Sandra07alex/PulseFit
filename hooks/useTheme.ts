// useTheme hook
import { useContext } from 'react';
import { theme } from '~/theme';

export const useTheme = () => {
  return theme;
};

export type UseThemeReturn = ReturnType<typeof useTheme>;
