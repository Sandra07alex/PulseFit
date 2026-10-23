/**
 * @file WorkoutScreen.tsx
 * @description "Move" tab – log workouts, see today's active minutes and the week.
 */

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  BounceIn,
  ClayBars,
  ClayButton,
  ClayCard,
  ClayIcon,
  ClayLabel,
  ClayRing,
  ClayScreen,
  ClaySectionHeader,
  ClayTitle,
} from '../../../components/clay';
import { Companion } from '../../../components/mascot/Companion';
import { clayTints } from '../../../theme/clay';
import { typography } from '../../../theme/typography';
import { useToast } from '../../../hooks/useToast';
import { useHaptics } from '../../../hooks/useHaptics';
import { confirmAction } from '../../../utils/confirm';
import { shortTime, weekdayInitial } from '../../../utils/date';
import { useWorkouts } from '../hooks/useWorkouts';
import { LogWorkoutSheet } from '../components/LogWorkoutSheet';
import { presetForCategory, WORKOUT_GOAL_MINUTES, WORKOUT_PRESETS, WorkoutPreset } from '../constants';
import type { Workout } from '../../../types/models';

const SessionRow: React.FC<{ workout: Workout; onDelete: () => void }> = ({ workout, onDelete }) => {
  const preset = presetForCategory(workout.category);
  return (
    <ClayCard tint="cloud" depth="sm" radius={22} padding={12} glow="soft" contentStyle={styles.row}>
      <ClayIcon emoji={preset.emoji} tint={preset.tint} size={44} />
      <View style={{ flex: 1 }}>
        <ClayTitle size={16}>{workout.title}</ClayTitle>
        <ClayLabel>
          {workout.durationMinutes} min · {workout.caloriesBurned} kcal · {shortTime(workout.completedAt)}
        </ClayLabel>
      </View>
      <Pressable onPress={onDelete} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Delete ${workout.title}`}>
        <Text style={styles.trash}>🗑️</Text>
      </Pressable>
    </ClayCard>
  );
};

export function WorkoutScreen() {
  const params = useLocalSearchParams<{ log?: string }>();
  const toast = useToast();
  const haptics = useHaptics();
  const { today, todayMinutes, todayCalories, week, estimateCalories, addWorkout, removeWorkout, refresh, isLoading } =
    useWorkouts();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [preset, setPreset] = useState<WorkoutPreset | undefined>();

  // Quick action from the nav opens the log sheet
  useEffect(() => {
    if (params.log) {
      setPreset(undefined);
      setSheetOpen(true);
    }
  }, [params.log]);

  const pct = Math.min(100, Math.round((todayMinutes / WORKOUT_GOAL_MINUTES) * 100));
  const goalDone = todayMinutes >= WORKOUT_GOAL_MINUTES;

  const open = (p?: WorkoutPreset) => {
    setPreset(p);
    setSheetOpen(true);
  };

  const remove = async (w: Workout) => {
    if (await confirmAction('Delete workout?', `Remove ${w.title} (${w.durationMinutes} min)?`)) {
      await removeWorkout(w.id);
    }
  };

  return (
    <ClayScreen
      title="Move"
      subtitle={goalDone ? 'Goal smashed! Blaze is proud 🔥' : 'Every minute counts!'}
      companionId="blaze"
      companionMood={goalDone ? 'celebrate' : 'idle'}
      refreshing={isLoading}
      onRefresh={refresh}
      overlay={
        <LogWorkoutSheet
          visible={sheetOpen}
          initialPreset={preset}
          onClose={() => setSheetOpen(false)}
          estimateCalories={estimateCalories}
          onSave={async (w) => {
            await addWorkout(w);
            haptics.success();
            toast.showSuccess(`${w.title} logged! +${w.durationMinutes} min 💪`, 'blaze');
          }}
        />
      }
    >
      {/* Hero */}
      <BounceIn>
        <ClayCard tint="cloud" depth="lg" radius={32} padding={20} glow="strong" contentStyle={styles.hero}>
          <ClayRing percentage={pct} size={132} stroke={18} tint="blaze">
            <ClayTitle size={30} color={clayTints.blaze.accent}>{todayMinutes}</ClayTitle>
            <ClayLabel style={{ marginTop: -4 }}>/ {WORKOUT_GOAL_MINUTES} min</ClayLabel>
          </ClayRing>
          <View style={styles.heroStats}>
            <ClayCard tint="blaze" depth="sm" radius={20} padding={12} glow="soft">
              <Text style={styles.statValue}>🔥 {todayCalories}</Text>
              <Text style={styles.statLabel}>kcal burned</Text>
            </ClayCard>
            <ClayCard tint="eggsy" depth="sm" radius={20} padding={12} glow="soft">
              <Text style={[styles.statValue, { color: clayTints.eggsy.ink }]}>⚡ {today.length}</Text>
              <Text style={[styles.statLabel, { color: clayTints.eggsy.ink }]}>sessions</Text>
            </ClayCard>
          </View>
        </ClayCard>
      </BounceIn>

      <BounceIn delay={80}>
        <ClayButton label="Log a workout" icon="➕" tint="blaze" size="lg" fullWidth onPress={() => open()} />
      </BounceIn>

      {/* Quick start */}
      <BounceIn delay={140}>
        <ClaySectionHeader title="Quick start" subtitle="Tap to log in seconds" />
        <View style={styles.grid}>
          {WORKOUT_PRESETS.map((p) => (
            <ClayCard
              key={p.id}
              tint={p.tint}
              depth="md"
              radius={22}
              padding={0}
              glow="soft"
              onPress={() => open(p)}
              accessibilityLabel={`Log ${p.label}`}
              style={styles.tile}
              contentStyle={styles.tileFace}
            >
              <Text style={styles.tileEmoji}>{p.emoji}</Text>
              <Text style={[styles.tileLabel, { color: clayTints[p.tint].ink }]}>{p.label}</Text>
            </ClayCard>
          ))}
        </View>
      </BounceIn>

      {/* Week */}
      <BounceIn delay={200}>
        <ClaySectionHeader title="This week" subtitle="Active minutes per day" />
        <ClayCard tint="cloud" depth="md" radius={28} padding={18}>
          <ClayBars
            tint="blaze"
            goal={WORKOUT_GOAL_MINUTES}
            data={week.map((w) => ({ label: weekdayInitial(w.day), value: w.minutes }))}
          />
        </ClayCard>
      </BounceIn>

      {/* Today */}
      <BounceIn delay={260}>
        <ClaySectionHeader title="Today's sessions" />
        {today.length === 0 ? (
          <ClayCard tint="cloud" depth="md" radius={28} padding={24} contentStyle={styles.empty}>
            <Companion id="blaze" mood="sleep" size={84} />
            <ClayTitle size={18}>No sweat yet today</ClayTitle>
            <ClayLabel style={{ textAlign: 'center' }}>
              Even a 10-minute walk wakes Blaze up!
            </ClayLabel>
          </ClayCard>
        ) : (
          <View style={{ gap: 10 }}>
            {today.map((w) => (
              <SessionRow key={w.id} workout={w} onDelete={() => remove(w)} />
            ))}
          </View>
        )}
      </BounceIn>
    </ClayScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroStats: {
    flex: 1,
    gap: 12,
  },
  statValue: {
    fontFamily: typography.fonts.display,
    fontSize: 22,
    color: '#FFFFFF',
  },
  statLabel: {
    fontFamily: typography.fonts.displayMedium,
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '22%',
    flexGrow: 1,
  },
  tileFace: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 4,
  },
  tileEmoji: {
    fontSize: 28,
  },
  tileLabel: {
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trash: {
    fontSize: 18,
    padding: 4,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
  },
});

