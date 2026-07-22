import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import { Companion } from '../mascot/Companion';
import { QuickActionRadialMenu, QuickActionOption } from './QuickActionRadialMenu';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';
import { radius } from '../../theme/radius';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
}

export interface FloatingIslandNavProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onQuickActionSelect?: (actionId: QuickActionOption['id']) => void;
  tabs?: TabItem[];
}

const DEFAULT_TABS: TabItem[] = [
  { id: 'today', label: 'Today', icon: '🏠' },
  { id: 'activity', label: 'Activity', icon: '🔥' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥦' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export const FloatingIslandNav: React.FC<FloatingIslandNavProps> = ({
  activeTab,
  onTabPress,
  onQuickActionSelect,
  tabs = DEFAULT_TABS,
}) => {
  const [quickActionVisible, setQuickActionVisible] = useState(false);
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const safeIndex = activeIndex >= 0 ? activeIndex : 0;

  // Active tab pill indicator spring translation
  const indicatorAnim = useRef(new Animated.Value(safeIndex)).current;

  useEffect(() => {
    Animated.spring(indicatorAnim, {
      toValue: safeIndex,
      tension: 180,
      friction: 14,
      useNativeDriver: true,
    }).start();
  }, [safeIndex, indicatorAnim]);

  // Divide nav bar width (excluding center mascot gap)
  const navContainerWidth = Math.min(SCREEN_WIDTH - 32, 380);
  const totalTabs = tabs.length;

  // Interpolate active indicator position
  // Left half tabs (indices 0, 1), Right half tabs (indices 2, 3) with gap for center mascot button
  const getTabTranslateX = (index: number) => {
    const tabWidth = (navContainerWidth - 72) / totalTabs; // subtract center mascot button width
    let posX = index * tabWidth;
    if (index >= 2) {
      posX += 72; // center mascot gap offset
    }
    return posX;
  };

  const indicatorTranslateX = indicatorAnim.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => getTabTranslateX(i)),
  });

  const activeTabWidth = (navContainerWidth - 72) / totalTabs;

  return (
    <View style={styles.outerWrapper}>
      {/* Floating Island Container */}
      <View style={[styles.islandContainer, { width: navContainerWidth }, shadows.floatingNav]}>
        {/* Active Pill Indicator */}
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: activeTabWidth - 8,
              transform: [{ translateX: indicatorTranslateX }],
            },
          ]}
        />

        {/* Navigation Tabs (Left half) */}
        <View style={styles.tabSection}>
          {tabs.slice(0, 2).map((tab, idx) => {
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.7}
                style={styles.tabButton}
                onPress={() => onTabPress(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Center Mascot Button Gap Spacer */}
        <View style={styles.centerGapSpacer} />

        {/* Navigation Tabs (Right half) */}
        <View style={styles.tabSection}>
          {tabs.slice(2, 4).map((tab, idx) => {
            const actualIdx = idx + 2;
            const isActive = tab.id === activeTab;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.7}
                style={styles.tabButton}
                onPress={() => onTabPress(tab.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating Overlapping Mascot Button */}
      <View style={styles.mascotButtonPosition}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setQuickActionVisible(true)}
          style={styles.mascotTouchable}
          accessibilityRole="button"
          accessibilityLabel="Open Quick Log Menu"
        >
          <View style={[styles.mascotGlowRing, shadows.mascotGlow]}>
            <Companion id="pulse" mood="idle" size={62} animated={true} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Radial Quick Action Menu Overlay */}
      <QuickActionRadialMenu
        visible={quickActionVisible}
        onClose={() => setQuickActionVisible(false)}
        onSelectAction={(actionId) => {
          if (onQuickActionSelect) {
            onQuickActionSelect(actionId);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  islandContainer: {
    height: 66,
    borderRadius: radius.navPill,
    backgroundColor: colors.lightMode.navBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.glass.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  tabSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  centerGapSpacer: {
    width: 64,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.gray500,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  mascotButtonPosition: {
    position: 'absolute',
    top: -18,
    alignSelf: 'center',
    zIndex: 10,
  },
  mascotTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotGlowRing: {
    width: 68,
    height: 68,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primarySoft,
  },
});
