import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { FloatingIslandNav, TabItem } from '../../components/navigation/FloatingIslandNav';
import { useToast } from '../../hooks/useToast';

const NAV_TABS: TabItem[] = [
  { id: 'today', label: 'Today', icon: '🏠' },
  { id: 'activity', label: 'Activity', icon: '🔥' },
  { id: 'nutrition', label: 'Nutrition', icon: '🥦' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { showSuccess } = useToast();

  // Map route to tab ID
  const getActiveTabId = () => {
    if (pathname.includes('/workout')) return 'activity';
    if (pathname.includes('/nutrition')) return 'nutrition';
    if (pathname.includes('/profile')) return 'profile';
    return 'today';
  };

  const handleTabPress = (tabId: string) => {
    switch (tabId) {
      case 'activity':
        router.push('/(tabs)/workout');
        break;
      case 'nutrition':
        router.push('/(tabs)/nutrition');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      case 'today':
      default:
        router.push('/(tabs)/home');
        break;
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'food':
        showSuccess('Quick Log: Food item added!', 'brocco');
        break;
      case 'water':
        showSuccess('Quick Log: +250ml Water logged!', 'droppy');
        break;
      case 'workout':
        showSuccess('Quick Log: Workout started!', 'blaze');
        break;
      case 'weight':
        showSuccess('Quick Log: Weight updated!', 'eggsy');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar in favor of Floating Island
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Today' }} />
        <Tabs.Screen name="workout" options={{ title: 'Activity' }} />
        <Tabs.Screen name="nutrition" options={{ title: 'Nutrition' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {/* Floating Island Navigation Layer */}
      <FloatingIslandNav
        activeTab={getActiveTabId()}
        onTabPress={handleTabPress}
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
