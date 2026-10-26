import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClayBackground } from './ClayBackground';
import { ClayLabel, ClayTitle } from './ClayBits';
import { Companion } from '../mascot/Companion';
import type { CompanionId, CompanionMood } from '../mascot/types';
import { clayTints } from '../../theme/clay';

export interface ClayScreenProps {
  title?: string;
  subtitle?: string;
  companionId?: CompanionId;
  companionMood?: CompanionMood;
  /** Element rendered at the right of the title row */
  headerRight?: React.ReactNode;
  /** Custom header replacing the title block */
  header?: React.ReactNode;
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Show the background polka dots */
  pattern?: boolean;
  /** Leave room at the bottom for the floating island nav */
  withNav?: boolean;
  /** Content rendered above the scroll view (sheets, FABs) */
  overlay?: React.ReactNode;
}

/** Standard PulseFit screen: cream backdrop, mascot header, scrolling clay content */
export const ClayScreen: React.FC<ClayScreenProps> = ({
  title,
  subtitle,
  companionId,
  companionMood = 'idle',
  headerRight,
  header,
  children,
  refreshing = false,
  onRefresh,
  pattern = true,
  withNav = true,
  overlay,
}) => {
  const insets = useSafeAreaInsets();
  const accent = clayTints[companionId ?? 'pulse'].accent;

  return (
    <ClayBackground pattern={pattern}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 12,
            paddingBottom: withNav ? insets.bottom + 130 : insets.bottom + 32,
          },
        ]}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={accent} colors={[accent]} />
          ) : undefined
        }
      >
        {header ??
          (title ? (
            <View style={styles.header}>
              {companionId ? <Companion id={companionId} mood={companionMood} size={68} /> : null}
              <View style={{ flex: 1 }}>
                <ClayTitle size={28}>{title}</ClayTitle>
                {subtitle ? <ClayLabel style={{ fontSize: 14 }}>{subtitle}</ClayLabel> : null}
              </View>
              {headerRight}
            </View>
          ) : null)}
        {children}
      </ScrollView>
      {overlay}
    </ClayBackground>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    gap: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
