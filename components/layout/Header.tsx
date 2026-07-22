import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Companion } from '../mascot/Companion';
import { CompanionId, CompanionMood } from '../mascot/types';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  largeTitle?: boolean;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  companionId?: CompanionId;
  companionMood?: CompanionMood;
  greeting?: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  largeTitle = true,
  leftAction,
  rightAction,
  companionId,
  companionMood = 'idle',
  greeting,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, spacing.md) },
        style,
      ]}
    >
      <View style={styles.topRow}>
        {leftAction ? <View style={styles.actionLeft}>{leftAction}</View> : <View style={styles.actionSpacer} />}

        {companionId && (
          <View style={styles.mascotGroup}>
            <Companion id={companionId} mood={companionMood} size="sm" animated={true} />
            {greeting && <Text style={[styles.greetingText, { color: colors.textSecondary }]}>{greeting}</Text>}
          </View>
        )}

        {rightAction ? <View style={styles.actionRight}>{rightAction}</View> : <View style={styles.actionSpacer} />}
      </View>

      {(title || subtitle) && (
        <View style={styles.titleGroup}>
          {title && (
            <Text style={[largeTitle ? styles.largeTitle : styles.smallTitle, { color: colors.text }]}>
              {title}
            </Text>
          )}
          {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  actionLeft: {
    alignItems: 'flex-start',
  },
  actionRight: {
    alignItems: 'flex-end',
  },
  actionSpacer: {
    width: 32,
  },
  mascotGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  greetingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  titleGroup: {
    marginTop: spacing.xs,
  },
  largeTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  smallTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
});
