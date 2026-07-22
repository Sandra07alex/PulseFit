import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing, colors } from '../../theme';

interface ScreenProps extends ViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  padding?: number;
}

export const Screen = React.forwardRef<View, ScreenProps>(
  ({ children, safeArea = true, padding = spacing.md, style, ...props }, ref) => {
    const styles = StyleSheet.create({
      base: {
        flex: 1,
        backgroundColor: colors.background,
        padding,
      },
    });

    const content = (
      <View
        ref={ref}
        style={[styles.base, style]}
        {...props}
      >
        {children}
      </View>
    );

    return safeArea ? <SafeAreaView style={{ flex: 1 }}>{content}</SafeAreaView> : content;
  },
);

Screen.displayName = 'Screen';
