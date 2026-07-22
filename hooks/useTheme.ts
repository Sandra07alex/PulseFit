import { useContext } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';
import { colors } from '../theme/colors';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      mode: 'light' as const,
      setMode: () => {},
      isDark: false,
      colors: colors.lightMode,
    };
  }
  return {
    mode: context.mode,
    setMode: context.setMode,
    isDark: context.isDark,
    colors: context.isDark ? colors.darkMode : colors.lightMode,
  };
};
