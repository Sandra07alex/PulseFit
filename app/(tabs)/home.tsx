/**
 * @file home.tsx
 * @description PulseFit "Today" dashboard – clay 3D edition.
 *
 *  - Pulse hero with the daily score
 *  - Daily quests: reacting companions, progress and quick-log buttons
 *  - Funny coach quote at the top (tap for another)
 *  - Streak strip and recent activity
 *
 * Data is offline-first via useDashboardData (reloads on focus).
 */

import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BounceIn,
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
import { QuestRow } from '../../features/dashboard/components/QuestRow';
import { WaterRepository } from '../../features/hydration/services/WaterRepository';
import { QuoteService } from '../../services/QuoteService';
import { clay } from '../../theme/clay';
import { typography } from '../../theme/typography';
import { useHaptics } from '../../hooks/useHaptics';
import { useToast } from '../../hooks/useToast';

const METRIC_ROUTE: Record<string, string> = {
  calories: '/(tabs)/nutrition',
  protein: '/(tabs)/nutrition',
  water: '/(tabs)/water',
  workout: '/(tabs)/workout',
};

export default function HomeScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const toast = useToast();
  const greeting = useGreeting();
  const streak = useStreak();
  const [quote, setQuote] = useState(() => QuoteService.getFunnyQuote());

  const { userName, metrics, caloriesPct, proteinPct, waterPct, workoutPct, recentActivity, isLoading, refresh } =
    useDashboardData();
  const score = useDailyScore({ caloriesPct, proteinPct, waterPct, workoutPct });

  const questsDone = metrics.filter((m) => m.percentage >= 100).length;
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

  const quickAdd = (id: string) => {
    switch (id) {
      case 'water':
        quickWater(250);
        break;
      case 'workout':
        router.navigate({ pathname: '/(tabs)/workout', params: { log: String(Date.now()) } });
        break;
      default:
        router.push('/food/add');
    }
  };

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
      {/* Funny quote of the moment */}
      <BounceIn>
        <ClayCard
          tint="cloud"
          depth="md"
          radius={24}
          padding={16}
          onPress={() => setQuote(QuoteService.getFunnyQuote(quote.id))}
          accessibilityLabel="Show another quote"
          contentStyle={styles.quoteRow}
        >
          <Text style={styles.quoteEmoji}>😂</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.quote}>{quote.text}</Text>
            <ClayLabel style={{ marginTop: 6, fontSize: 11 }}>Tap for another one 🔄</ClayLabel>
          </View>
        </ClayCard>
      </BounceIn>

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
            <ClayProgressBar percentage={score.score} tint="pulse" height={16} />
          </View>
          <View style={styles.streakStrip}>
            <Text style={styles.streakText}>🔥 {streak.current}-day streak</Text>
            <Text style={styles.streakText}>best {streak.longest}</Text>
          </View>
        </ClayCard>
      </BounceIn>

      {/* Daily quests */}
      <BounceIn delay={80}>
        <ClaySectionHeader
          title="Today's quests"
          subtitle={
            questsDone === metrics.length && metrics.length > 0
              ? 'All quests complete! You legend 🏆'
              : `${questsDone} of ${metrics.length} done · tap + to log`
          }
        />
        <View style={styles.quests}>
          {metrics.map((m, i) => (
            <BounceIn key={m.id} delay={120 + i * 70}>
              <QuestRow
                metric={m}
                onPress={() => router.navigate((METRIC_ROUTE[m.id] ?? '/(tabs)/home') as never)}
                onQuickAdd={() => quickAdd(m.id)}
                quickLabel={m.id === 'water' ? 'Add 250 ml water' : `Log ${m.label.toLowerCase()}`}
              />
            </BounceIn>
          ))}
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
                <ClayIcon emoji={a.icon} size={40} tint="cloud" />
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
  quests: { gap: 12 },
  quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quoteEmoji: { fontSize: 30 },
  quote: { fontFamily: typography.fonts.displayMedium, fontSize: 15, color: clay.ink.primary, lineHeight: 21 },
  empty: { alignItems: 'center', gap: 8 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
