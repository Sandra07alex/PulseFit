import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { FloatingIslandNav, TabItem } from '../../components/navigation/FloatingIslandNav';
import type { QuickActionOption } from '../../components/navigation/QuickActionRadialMenu';

const NAV_TABS: TabItem[] = [
  { id: 'today', label: 'Today', icon: '🏠', tint: 'pulse' },
  { id: 'move', label: 'Move', icon: '🔥', tint: 'blaze' },
  { id: 'eat', label: 'Eat', icon: '🥦', tint: 'brocco' },
  { id: 'stats', label: 'Stats', icon: '📈', tint: 'luna' },
];

const TAB_ROUTES = {
  today: '/(tabs)/home',
  move: '/(tabs)/workout',
  eat: '/(tabs)/nutrition',
  stats: '/(tabs)/progress',
} as const;

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = pathname.includes('/workout')
    ? 'move'
    : pathname.includes('/nutrition')
    ? 'eat'
    : pathname.includes('/progress')
    ? 'stats'
    : pathname.includes('/home')
    ? 'today'
    : ''; // water & profile are reached from Today, no tab highlighted

  const handleQuickAction = (actionId: QuickActionOption['id']) => {
    switch (actionId) {
      case 'food':
        router.push('/food/add');
        break;
      case 'water':
        router.navigate('/(tabs)/water');
        break;
      case 'workout':
        router.navigate({ pathname: '/(tabs)/workout', params: { log: String(Date.now()) } });
        break;
      case 'weight':
        router.navigate({ pathname: '/(tabs)/progress', params: { log: String(Date.now()) } });
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // replaced by the Floating Island
          animation: 'shift',
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Today' }} />
        <Tabs.Screen name="workout" options={{ title: 'Move' }} />
        <Tabs.Screen name="nutrition" options={{ title: 'Eat' }} />
        <Tabs.Screen name="progress" options={{ title: 'Stats' }} />
        <Tabs.Screen name="water" options={{ title: 'Water' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      <FloatingIslandNav
        activeTab={activeTab}
        onTabPress={(id) => router.navigate(TAB_ROUTES[id as keyof typeof TAB_ROUTES])}
        onQuickActionSelect={handleQuickAction}
        tabs={NAV_TABS}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
