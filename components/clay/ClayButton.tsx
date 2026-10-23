import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { ClayCard } from './ClayCard';
import { clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';

export interface ClayButtonProps {
  label: string;
  onPress?: () => void;
  tint?: ClayTint;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode | string;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const SIZES = {
  sm: { height: 40, font: 14, px: 16, depth: 'sm' as const },
  md: { height: 52, font: 16, px: 22, depth: 'md' as const },
  lg: { height: 60, font: 18, px: 28, depth: 'lg' as const },
};

/** Puffy pill button that physically presses down */
export const ClayButton: React.FC<ClayButtonProps> = ({
  label,
  onPress,
  tint = 'pulse',
  size = 'md',
  icon,
  disabled,
  loading,
  fullWidth,
  style,
  labelStyle,
  accessibilityLabel,
}) => {
  const s = SIZES[size];
  const t = clayTints[tint];
  return (
    <ClayCard
      tint={tint}
      depth={s.depth}
      radius={999}
      padding={0}
      glow={disabled ? 'none' : 'soft'}
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[fullWidth && { alignSelf: 'stretch' }, disabled && { opacity: 0.5 }, style]}
      contentStyle={[styles.content, { height: s.height, paddingHorizontal: s.px }]}
    >
      {loading ? (
        <ActivityIndicator color={t.ink} />
      ) : (
        <View style={styles.row}>
          {typeof icon === 'string' ? <Text style={{ fontSize: s.font + 2 }}>{icon}</Text> : icon}
          <Text
            numberOfLines={1}
            style={[styles.label, { fontSize: s.font, color: t.ink }, labelStyle]}
          >
            {label}
          </Text>
        </View>
      )}
    </ClayCard>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: typography.fonts.display,
    letterSpacing: 0.2,
  },
});
