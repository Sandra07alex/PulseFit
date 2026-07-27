/**
 * @file RecentActivityList.tsx
 * @description Scrollable list of the user's most recent activity entries.
 *
 * Shows meals, water logs, workouts, and weight entries in a unified feed.
 * Falls back to the DashboardEmptyState when no activity exists.
 *
 * Each row slides in with a staggered animation.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { DashboardEmptyState } from './DashboardEmptyState';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import type { RecentActivityEntry } from '../types/dashboard.types';

// ---------------------------------------------------------------------------
// Single activity row
// ---------------------------------------------------------------------------

interface ActivityRowProps {
  entry: RecentActivityEntry;
  index: number;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ entry, index }) => {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0,
        tension: 140,
        friction: 16,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <Animated.View
      style={[
        styles.row,
        { opacity, transform: [{ translateX }] },
      ]}
    >
      {/* Icon badge */}
      <View style={[styles.iconBadge, { backgroundColor: entry.accentColor + '15' }]}>
        <Text style={styles.rowIcon}>{entry.icon}</Text>
      </View>

      {/* Text */}
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>{entry.title}</Text>
        <Text style={styles.rowDetail} numberOfLines={1}>{entry.detail}</Text>
      </View>

      {/* Time */}
      <Text style={styles.rowTime}>{entry.timeLabel}</Text>
    </Animated.View>
  );
};

// ---------------------------------------------------------------------------
// List component
// ---------------------------------------------------------------------------

interface RecentActivityListProps {
  entries: RecentActivityEntry[];
  onAddPress?: () => void;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  entries,
  onAddPress,
}) => {
  if (entries.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        <DashboardEmptyState
          variant="activity"
          onCtaPress={onAddPress}
          inline
        />
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {entries.map((entry, index) => (
        <ActivityRow key={entry.id} entry={entry} index={index} />
      ))}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  listContainer: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.lightMode.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...shadows.card,
  },
  emptyWrapper: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.lightMode.surface,
    borderRadius: radius.card,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowIcon: {
    fontSize: 18,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.lightMode.text,
    letterSpacing: -0.1,
  },
  rowDetail: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.lightMode.textSecondary,
  },
  rowTime: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.lightMode.textTertiary,
    flexShrink: 0,
  },
});
