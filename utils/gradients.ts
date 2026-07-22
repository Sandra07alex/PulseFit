import { colors } from '../theme/colors';

/**
 * Gradient Colors Lookup Helper
 */

export function getCompanionGradient(companionId: string): readonly [string, string] {
  const companionColor = (colors.companions as any)[companionId];
  if (companionColor && companionColor.gradient) {
    return companionColor.gradient;
  }
  return colors.gradients.primary;
}
