/**
 * @file home.tsx
 * @description PulseFit "Today" dashboard – clay 3D edition.
 *
 *  - Pulse hero with the daily score
 *  - 2×2 metric cards (tap to jump to the matching screen)
 *  - One-tap water from the home screen
 *  - Coach quote bubble, streak strip and recent activity
 *
 * Data is offline-first via useDashboardData (reloads on focus).
 */

import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BounceIn,
  ClayButton,
  ClayCard,
  ClayIcon,
  ClayLabel,
  ClayProgressBar,
  ClayScreen,
  ClaySectionHeader,
  ClayTitle,
} from '../../components/clay';
import { Companion } from '../../components/mascot/Companion';
import type { CompanionMood } from '../../components/mascot/types';
import { useDashboardData, useDailyScore, useGreeting, useStreak } from '../../features/dashboard';
import type { MetricProgress } from '../../features/dashboard';
import { WaterRepository } from '../../features/hydration/services/WaterRepository';
import { QuoteService } from '../../services/QuoteService';
import { clay, clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';
import { useHaptics } from '../../hooks/useHaptics';
import { useToast } from '../../hooks/useToast';

const METRIC_STYLE: Record<string, { tint: ClayTint; route: string }> = {
  calories: { tint: 'blaze', route: '/(tabs)/nutrition' },
  protein: { tint: 'eggsy', route: '/(tabs)/nutrition' },
  water: { tint: 'droppy', route: '/(tabs)/water' },
  workout: { tint: 'pulse', route: '/(tabs)/workout' },
};

const fmtMl = (ml: number) => (ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`);

const MetricCard: React.FC<{ metric: MetricProgress; onPress: () => void }> = ({ metric, onPress }) => {
  const { tint } = METRIC_STYLE[metric.id] ?? { tint: 'pulse' as ClayTint };
  const t = clayTints[tint];
  const value = metric.id === 'water' ? fmtMl(metric.current) : metric.current.toLocaleString();
  const goal = metric.id === 'water' ? fmtMl(metric.goal) : `${metric.goal.toLocaleString()} ${metric.unit}`;
  return (
    <ClayCard
      tint="cloud"
      depth="md"
      radius={26}
      padding={14}
      onPress={onPress}
      accessibilityLabel={`${metric.label}: ${value} of ${goal}`}
      style={styles.metric}
      contentStyle={{ gap: 8 }}
    >
      <View style={styles.metricTop}>
        <ClayIcon emoji={metric.icon} tint={tint} size={38} />
        <Text style={[styles.metricPct, { color: t.accent }]}>{metric.percentage}%</Text>
      </View>
      <ClayLabel>{metric.label}</ClayLabel>
      <View style={styles.metricValueRow}>
        <ClayTitle size={22} color={t.accent}>{value}</ClayTitle>
        <ClayLabel style={{ fontSize: 11 }}> / {goal}</ClayLabel>
      </View>
      <ClayProgressBar percentage={metric.percentage} tint={tint} height={12} />
    </ClayCard>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const toast = useToast();
  const greeting = useGreeting();
  const streak = useStreak();
  const [quote, setQuote] = useState(() => QuoteService.getTimeBasedQuote());

  const { userName, metrics, caloriesPct, proteinPct, waterPct, workoutPct, waterGoal, recentActivity, isLoading, refresh } =
    useDashboardData();
  const score = useDailyScore({ caloriesPct, proteinPct, waterPct, workoutPct });

  const waterMetric = metrics.find((m) => m.id === 'water');
  const mood: CompanionMood = score.score >= 80 ? 'celebrate' : score.score >= 35 ? 'wave' : 'idle';

  const quickWater = useCallback(
    async (ml: number) => {
      await WaterRepository.create(ml);
      haptics.success();
      toast.showSuccess(`+${ml}ml water 💧`, 'droppy');
      refresh();
      streak.refresh();
    },
    [haptics, toast, refresh, streak]
  );

  const header = (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <ClayLabel style={{ fontSize: 14 }}>
          {greeting.greeting} {greeting.emoji}
        </ClayLabel>
        <ClayTitle size={30} numberOfLines={1}>
          Hi, {userName}!
        </ClayTitle>
      </View>
      <Pressable onPress={() => router.navigate('/(tabs)/profile')} accessibilityRole="button" accessibilityLabel="Profile">
        <ClayCard tint="cloud" depth="sm" radius={26} padding={0} contentStyle={styles.avatar}>
          <Companion id="pulse" mood="idle" size={40} animated={false} />
        </ClayCard>
      </Pressable>
    </View>
  );

  return (
    <ClayScreen header={header} refreshing={isLoading} onRefresh={refresh}>
      {/* Hero: daily score with Pulse */}
      <BounceIn>
        <ClayCard tint="pulse" depth="lg" radius={34} padding={20} glow="strong">
          <View style={styles.heroRow}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.heroKicker}>Daily score</Text>
              <View style={styles.heroScoreRow}>
                <Text style={styles.heroScore}>{score.score}</Text>
                <Text style={styles.heroOutOf}>/100</Text>
              </View>
              <Text style={styles.heroTier}>{score.label}</Text>
            </View>
            <Companion id="pulse" mood={mood} size={118} />
          </View>
          <View style={{ marginTop: 12 }}>
            <ClayProgressBar percentage={score.score} tint="eggsy" height={16} />
          </View>
          <View style={styles.streakStrip}>
            <Text style={styles.streakText}>🔥 {streak.current}-day streak</Text>
            <Text style={styles.streakText}>best {streak.longest}</Text>
          </View>
        </ClayCard>
      </BounceIn>

      {/* Metrics */}
      <BounceIn delay={80}>
        <ClaySectionHeader title="Today's progress" subtitle="Tap a card to log more" />
        <View style={styles.grid}>
          {metrics.map((m) => (
            <MetricCard
              key={m.id}
              metric={m}
              onPress={() => router.navigate((METRIC_STYLE[m.id]?.route ?? '/(tabs)/home') as never)}
            />
          ))}
        </View>
      </BounceIn>

      {/* Quick water */}
      <BounceIn delay={140}>
        <ClayCard tint="droppy" depth="lg" radius={30} padding={18} glow="medium">
          <View style={styles.waterRow}>
            <Companion id="droppy" mood={waterPct >= 100 ? 'celebrate' : 'idle'} size={72} />
            <View style={{ flex: 1 }}>
              <Text style={styles.waterTitle}>Sip sip, hooray!</Text>
              <Text style={styles.waterSub}>
                {fmtMl(waterMetric?.current ?? 0)} of {fmtMl(waterGoal)} today
              </Text>
            </View>
          </View>
          <View style={styles.waterButtons}>
            {[250, 500].map((ml) => (
              <ClayButton
                key={ml}
                label={`+${ml}ml`}
                icon="💧"
                tint="cloud"
                size="sm"
                labelStyle={{ color: clayTints.droppy.accent }}
                style={{ flex: 1 }}
                onPress={() => quickWater(ml)}
              />
            ))}
            <ClayButton
              label="More"
              tint="cloud"
              size="sm"
              labelStyle={{ color: clayTints.droppy.accent }}
              style={{ flex: 1 }}
              onPress={() => router.navigate('/(tabs)/water')}
            />
          </View>
        </ClayCard>
      </BounceIn>

      {/* Coach quote */}
      <BounceIn delay={200}>
        <View style={styles.quoteRow}>
          <Companion id="luna" mood="wave" size={64} />
          <ClayCard
            tint="cloud"
            depth="md"
            radius={24}
            padding={16}
            style={{ flex: 1 }}
            onPress={() => setQuote(QuoteService.rotateQuote(quote.id))}
            accessibilityLabel="Show another quote"
          >
            <Text style={styles.quote}>“{quote.text}”</Text>
            <ClayLabel style={{ marginTop: 6, fontSize: 11 }}>Tap for another ✨</ClayLabel>
          </ClayCard>
        </View>
      </BounceIn>

      {/* Recent activity */}
      <BounceIn delay={260}>
        <ClaySectionHeader title="Recent activity" />
        {recentActivity.length === 0 ? (
          <ClayCard tint="cloud" depth="md" radius={28} padding={22} contentStyle={styles.empty}>
            <Companion id="pulse" mood="thinking" size={80} />
            <ClayTitle size={17}>Nothing logged yet</ClayTitle>
            <ClayLabel style={{ textAlign: 'center' }}>Tap the big heart below to log your first thing!</ClayLabel>
          </ClayCard>
        ) : (
          <View style={{ gap: 10 }}>
            {recentActivity.map((a) => (
              <ClayCard key={a.id} tint="cloud" depth="sm" radius={22} padding={12} glow="soft" contentStyle={styles.activityRow}>
                <ClayIcon
                  emoji={a.icon}
                  size={40}
                  tint={a.type === 'water' ? 'droppy' : a.type === 'workout' ? 'blaze' : a.type === 'weight' ? 'luna' : 'brocco'}
                />
                <View style={{ flex: 1 }}>
                  <ClayTitle size={15} numberOfLines={1}>{a.title}</ClayTitle>
                  <ClayLabel numberOfLines={1}>{a.detail}</ClayLabel>
                </View>
                <ClayLabel style={{ fontSize: 11 }}>{a.timeLabel}</ClayLabel>
              </ClayCard>
            ))}
          </View>
        )}
      </BounceIn>
    </ClayScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center' },
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  heroKicker: { fontFamily: typography.fonts.displaySemibold, fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  heroScoreRow: { flexDirection: 'row', alignItems: 'flex-end' },
  heroScore: { fontFamily: typography.fonts.display, fontSize: 56, color: '#FFFFFF', lineHeight: 62 },
  heroOutOf: { fontFamily: typography.fonts.displaySemibold, fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 10, marginLeft: 2 },
  heroTier: { fontFamily: typography.fonts.displaySemibold, fontSize: 15, color: '#FFFFFF' },
  streakStrip: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  streakText: { fontFamily: typography.fonts.displaySemibold, fontSize: 13, color: '#FFFFFF' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metric: { width: '47%', flexGrow: 1 },
  metricTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metricPct: { fontFamily: typography.fonts.display, fontSize: 15 },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap' },
  waterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  waterTitle: { fontFamily: typography.fonts.display, fontSize: 20, color: '#FFFFFF' },
  waterSub: { fontFamily: typography.fonts.displayMedium, fontSize: 14, color: 'rgba(255,255,255,0.92)' },
  waterButtons: { flexDirection: 'row', gap: 10, marginTop: 14 },
  quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quote: { fontFamily: typography.fonts.displayMedium, fontSize: 15, color: clay.ink.primary, lineHeight: 21 },
  empty: { alignItems: 'center', gap: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
