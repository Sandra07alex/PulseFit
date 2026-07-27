/**
 * @file home.tsx
 * @description PulseFit Dashboard Screen — the beating heart of the app.
 *
 * Architecture:
 *  - Fully offline-first via useDashboardData + AsyncStorage
 *  - Modular sub-components from features/dashboard
 *  - Scroll view with large bottom padding for floating nav clearance
 *  - Pull-to-refresh support
 *  - Soft gradient background from design system
 *
 * Future-ready: All data hooks accept a userId param for Supabase integration.
 */

import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// Dashboard feature module
import {
  DashboardHeader,
  MotivationCard,
  ProgressCardGrid,
  SummarySection,
  QuickActionsGrid,
  StreakCard,
  RecentActivityList,
  useDashboardData,
  useGreeting,
  useDailyScore,
  useStreak,
} from '../../features/dashboard';
import type { QuickAction } from '../../features/dashboard';

// Design system
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// ---------------------------------------------------------------------------
// Section header helper
// ---------------------------------------------------------------------------

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({
  title,
  subtitle,
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

// ---------------------------------------------------------------------------
// Dashboard Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const greeting = useGreeting();

  // Core data
  const {
    userName,
    metrics,
    caloriesPct,
    proteinPct,
    waterPct,
    workoutPct,
    caloriesGoal,
    proteinGoal,
    waterGoal,
    workoutGoal,
    recentActivity,
    isLoading,
    refresh,
  } = useDashboardData();

  // Daily score — derived from metric percentages
  const dailyScore = useDailyScore({
    caloriesPct,
    proteinPct,
    waterPct,
    workoutPct,
  });

  // Streak
  const streak = useStreak();

  // ---------------------------------------------------------------------------
  // Computed summary values
  // ---------------------------------------------------------------------------

  const caloriesMetric   = metrics.find((m) => m.id === 'calories');
  const proteinMetric    = metrics.find((m) => m.id === 'protein');
  const waterMetric      = metrics.find((m) => m.id === 'water');
  const workoutMetric    = metrics.find((m) => m.id === 'workout');

  const caloriesRemaining = caloriesMetric?.remaining ?? caloriesGoal;
  const proteinRemaining  = proteinMetric?.remaining  ?? proteinGoal;
  const waterRemaining    = waterMetric?.remaining    ?? waterGoal;
  const workoutMinutes    = workoutMetric ? workoutMetric.goal - workoutMetric.remaining : 0;
  const workoutGoalMin    = workoutGoal;

  const workoutStatus: 'not_started' | 'in_progress' | 'done' =
    workoutMinutes === 0
      ? 'not_started'
      : workoutMinutes >= workoutGoalMin
      ? 'done'
      : 'in_progress';

  // ---------------------------------------------------------------------------
  // Quick action handler
  // ---------------------------------------------------------------------------

  const handleQuickAction = useCallback((id: QuickAction['id']) => {
    switch (id) {
      case 'food':
        router.push('/(tabs)/nutrition');
        break;
      case 'water':
        router.push('/(tabs)/nutrition');
        break;
      case 'workout':
        router.push('/(tabs)/workout');
        break;
      case 'weight':
        router.push('/(tabs)/profile');
        break;
    }
  }, [router]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightMode.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 120, 140) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* ── HEADER ──────────────────────────────────────────── */}
        <DashboardHeader
          greeting={greeting}
          userName={userName}
          onAvatarPress={() => router.push('/(tabs)/profile')}
        />

        {/* ── MOTIVATION CARD ─────────────────────────────────── */}
        <MotivationCard />

        {/* ── TODAY'S PROGRESS ────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTitle
            title="Today's Progress"
            subtitle="Tap a card to see details"
          />
          <ProgressCardGrid
            metrics={metrics}
            onCardPress={(id) => {
              // Navigate to relevant detail screen in future phases
            }}
          />
        </View>

        {/* ── TODAY'S SUMMARY ─────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTitle title="Today's Summary" />
          <SummarySection
            caloriesRemaining={caloriesRemaining}
            proteinRemaining={proteinRemaining}
            waterRemainingMl={waterRemaining}
            workoutMinutes={workoutMinutes}
            workoutGoalMinutes={workoutGoalMin}
            dailyScore={dailyScore}
          />
        </View>

        {/* ── QUICK ACTIONS ────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTitle
            title="Quick Actions"
            subtitle="Log your daily entries"
          />
          <QuickActionsGrid onActionPress={handleQuickAction} />
        </View>

        {/* ── STREAK ───────────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTitle title="Consistency Streak 🔥" />
          <StreakCard data={{
            current:        streak.current,
            longest:        streak.longest,
            weeklyActivity: streak.weeklyActivity,
          }} />
        </View>

        {/* ── RECENT ACTIVITY ──────────────────────────────────── */}
        <View style={styles.section}>
          <SectionTitle
            title="Recent Activity"
            subtitle="Your latest logged entries"
          />
          <RecentActivityList
            entries={recentActivity}
            onAddPress={() => router.push('/(tabs)/nutrition')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.lightMode.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 0,
  },
  section: {
    marginTop: spacing['3xl'],
    gap: spacing.lg,
  },
  sectionHeader: {
    paddingHorizontal: spacing.screenPadding,
    gap: 2,
  },
  sectionTitle: {
    fontSize: typography.variants.h5.size,
    fontWeight: String(typography.variants.h5.weight) as any,
    color: colors.lightMode.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: typography.variants.bodySmall.size,
    fontWeight: String(typography.variants.bodySmall.weight) as any,
    color: colors.lightMode.textSecondary,
  },
});
