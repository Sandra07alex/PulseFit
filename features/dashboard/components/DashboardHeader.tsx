/**
 * @file DashboardHeader.tsx
 * @description Premium dashboard header with:
 *  - Dynamic time-based greeting + emoji
 *  - User first name
 *  - Motivational subtitle
 *  - Avatar circle (initials with gradient background)
 *  - Notification bell (placeholder)
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';
import type { GreetingData } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DashboardHeaderProps {
  greeting: GreetingData;
  userName: string;
  onNotificationPress?: () => void;
  onAvatarPress?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Gradient avatar circle showing user initials */
const AvatarCircle: React.FC<{ name: string; onPress?: () => void }> = ({ name, onPress }) => {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.avatar}
      accessibilityLabel={`${name}'s profile`}
      accessibilityRole="button"
    >
      <Text style={styles.avatarInitials}>{initials}</Text>
    </TouchableOpacity>
  );
};

/** Bell icon with a dot indicator */
const NotificationBell: React.FC<{ onPress?: () => void; hasNew?: boolean }> = ({
  onPress,
  hasNew = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.bellButton}
    activeOpacity={0.7}
    accessibilityLabel="Notifications"
    accessibilityRole="button"
  >
    <Text style={styles.bellIcon}>🔔</Text>
    {hasNew && <View style={styles.bellDot} />}
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  greeting,
  userName,
  onNotificationPress,
  onAvatarPress,
}) => {
  const insets = useSafeAreaInsets();

  // Slide-in animation on mount
  const slideAnim  = useRef(new Animated.Value(-20)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const fullGreeting = `${greeting.greeting}, ${userName} ${greeting.emoji}`;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 8, 24) }]}>
      {/* Top row: avatar left, bell right */}
      <View style={styles.topRow}>
        <AvatarCircle name={userName} onPress={onAvatarPress} />
        <NotificationBell onPress={onNotificationPress} />
      </View>

      {/* Greeting block */}
      <Animated.View
        style={[
          styles.greetingBlock,
          { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
        ]}
      >
        <Text style={styles.greeting} accessibilityRole="header">
          {fullGreeting}
        </Text>
        <Text style={styles.subtitle}>{greeting.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.avatar,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: radius.avatar,
    backgroundColor: colors.lightMode.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  bellIcon: {
    fontSize: 20,
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  greetingBlock: {
    gap: 4,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.lightMode.text,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.lightMode.textSecondary,
    lineHeight: 20,
  },
});
