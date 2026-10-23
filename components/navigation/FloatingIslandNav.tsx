import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Companion } from '../mascot/Companion';
import { ClayCard } from '../clay/ClayCard';
import { QuickActionRadialMenu, QuickActionOption } from './QuickActionRadialMenu';
import { clay, clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';
import { useHaptics } from '../../hooks/useHaptics';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  tint?: ClayTint;
}

export interface FloatingIslandNavProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
  onQuickActionSelect?: (actionId: QuickActionOption['id']) => void;
  tabs?: TabItem[];
}

const DEFAULT_TABS: TabItem[] = [
  { id: 'today', label: 'Today', icon: '🏠', tint: 'pulse' },
  { id: 'move', label: 'Move', icon: '🔥', tint: 'blaze' },
  { id: 'eat', label: 'Eat', icon: '🥦', tint: 'brocco' },
  { id: 'stats', label: 'Stats', icon: '📈', tint: 'luna' },
];

/** One tab: the active one pops up into a tinted clay bubble */
const NavTab: React.FC<{ tab: TabItem; active: boolean; onPress: () => void }> = ({ tab, active, onPress }) => {
  const pop = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pop, { toValue: active ? 1 : 0, tension: 180, friction: 10, useNativeDriver: true }).start();
  }, [active, pop]);

  const tint = tab.tint ?? 'pulse';
  const translateY = pop.interpolate({ inputRange: [0, 1], outputRange: [0, -4] });
  const bubbleScale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: active }}
    >
      <Animated.View style={{ transform: [{ translateY }], alignItems: 'center' }}>
        <View style={styles.iconSlot}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { opacity: pop, transform: [{ scale: bubbleScale }] }]}
          >
            <ClayCard
              tint={tint}
              depth="sm"
              radius={16}
              padding={0}
              glow="soft"
              contentStyle={styles.iconSlot}
            />
          </Animated.View>
          <Text style={styles.icon}>{tab.icon}</Text>
        </View>
        <Text
          style={[
            styles.label,
            active && { color: clayTints[tint].accent, fontFamily: typography.fonts.display },
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

export const FloatingIslandNav: React.FC<FloatingIslandNavProps> = ({
  activeTab,
  onTabPress,
  onQuickActionSelect,
  tabs = DEFAULT_TABS,
}) => {
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const [menuOpen, setMenuOpen] = useState(false);

  const press = (id: string) => {
    haptics.light();
    onTabPress(id);
  };

  return (
    <View style={[styles.outer, { bottom: Math.max(insets.bottom, 12) + 6 }]} pointerEvents="box-none">
      <ClayCard
        tint="cloud"
        depth="md"
        radius={999}
        padding={0}
        glow="strong"
        style={styles.island}
        contentStyle={styles.islandFace}
      >
        {tabs.slice(0, 2).map((t) => (
          <NavTab key={t.id} tab={t} active={t.id === activeTab} onPress={() => press(t.id)} />
        ))}
        <View style={styles.centerGap} />
        {tabs.slice(2, 4).map((t) => (
          <NavTab key={t.id} tab={t} active={t.id === activeTab} onPress={() => press(t.id)} />
        ))}
      </ClayCard>

      {/* Center mascot button */}
      <View style={styles.centerButton} pointerEvents="box-none">
        <ClayCard
          tint="pulse"
          depth="lg"
          radius={40}
          padding={0}
          glow="strong"
          onPress={() => {
            haptics.medium();
            setMenuOpen(true);
          }}
          accessibilityLabel="Open quick log menu"
          contentStyle={styles.centerFace}
        >
          <Companion id="pulse" mood="idle" size={54} />
        </ClayCard>
      </View>

      <QuickActionRadialMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectAction={(id) => onQuickActionSelect?.(id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  island: {
    width: '92%',
    maxWidth: 400,
  },
  islandFace: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconSlot: {
    width: 40,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    marginTop: 1,
    fontSize: 11,
    fontFamily: typography.fonts.displayMedium,
    color: clay.ink.tertiary,
  },
  centerGap: {
    width: 76,
  },
  centerButton: {
    position: 'absolute',
    top: -26,
    alignSelf: 'center',
  },
  centerFace: {
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
