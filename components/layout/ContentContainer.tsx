import React from 'react';
import { ScrollView, View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../../theme/spacing';

export interface ContentContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  paddingBottom?: number;
  style?: ViewStyle;
}

export const ContentContainer: React.FC<ContentContainerProps> = ({
  children,
  scrollable = true,
  paddingBottom = 110, // accounts for floating island nav height + gap
  style,
}) => {
  if (scrollable) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom },
          style,
        ]}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.fixedContent, { paddingBottom }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xs,
  },
  fixedContent: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xs,
  },
});
