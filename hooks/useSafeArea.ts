import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '../theme/spacing';

export const useSafeArea = () => {
  const insets = useSafeAreaInsets();

  return {
    insets,
    paddingTop: insets.top || spacing.lg,
    paddingBottom: insets.bottom || spacing.lg,
    paddingLeft: insets.left || spacing.screenPadding,
    paddingRight: insets.right || spacing.screenPadding,
  };
};
