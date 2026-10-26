/**
 * @file QuestRow.tsx
 * @description One "daily quest" on the Today screen: a companion that reacts to
 * progress, a playful status line, a jelly progress bar and a quick-log button.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ClayCard, ClayLabel, ClayProgressBar, ClayTitle } from '../../../components/clay';
import { Companion } from '../../../components/mascot/Companion';
import type { CompanionId, CompanionMood } from '../../../components/mascot/types';
import { clay, clayTints } from '../../../theme/clay';
import { typography } from '../../../theme/typography';
import type { MetricProgress } from '../types/dashboard.types';

const ACCENT = clayTints.pulse.accent;

const fmtMl = (ml: number) => (ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`);

interface QuestCopy {
  companion: CompanionId;
  title: string;
  /** status line for 0%, in-progress and done */
  line: (m: MetricProgress, left: string) => string;
}

export const QUESTS: Record<string, QuestCopy> = {
  calories: {
    companion: 'brocco',
    title: 'Fuel up',
    line: (m, left) =>
      m.current === 0
        ? 'Brocco is waiting for your first bite 🍳'
        : m.percentage >= 100
        ? 'Tank full! Great fuelling today 🎉'
        : `${left} left to fuel your day`,
  },
  protein: {
    companion: 'eggsy',
    title: 'Protein power',
    line: (m, left) =>
      m.current === 0
        ? 'Eggsy is hungry for some protein 🥚'
        : m.percentage >= 100
        ? 'Muscles say thank you! 💪'
        : `Eggsy wants ${left} more`,
  },
  water: {
    companion: 'droppy',
    title: 'Hydrate',
    line: (m, left) =>
      m.current === 0
        ? 'Droppy is thirsty! One glass? 💧'
        : m.percentage >= 100
        ? 'Hydration hero! Droppy is splashing 💙'
        : `${left} to go, sip sip!`,
  },
  workout: {
    companion: 'blaze',
    title: 'Move it',
    line: (m, left) =>
      m.current === 0
        ? 'Blaze is napping. Wake them up! 🔥'
        : m.percentage >= 100
        ? 'Goal smashed! Blaze is on fire 🔥'
        : `${left} more to light the fire`,
  },
};

export function moodFor(pct: number, current: number): CompanionMood {
  if (current === 0) return 'sleep';
  if (pct >= 100) return 'celebrate';
  if (pct >= 50) return 'wave';
  return 'idle';
}

/** Number that counts up whenever its value changes */
const CountUp: React.FC<{ value: number; format: (v: number) => string; style?: object }> = ({ value, format, style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = React.useState(0);

  useEffect(() => {
    const id = anim.addListener(({ value: v }) => setShown(v));
    Animated.timing(anim, { toValue: value, duration: 700, useNativeDriver: false }).start();
    return () => anim.removeListener(id);
  }, [value, anim]);

  return <Text style={style}>{format(Math.round(shown))}</Text>;
};

export interface QuestRowProps {
  metric: MetricProgress;
  onPress: () => void;
  onQuickAdd: () => void;
  quickLabel: string;
}

export const QuestRow: React.FC<QuestRowProps> = ({ metric, onPress, onQuickAdd, quickLabel }) => {
  const quest = QUESTS[metric.id] ?? QUESTS.calories;
  const done = metric.percentage >= 100;
  const isWater = metric.id === 'water';
  const format = (v: number) => (isWater ? fmtMl(v) : v.toLocaleString());
  const goal = isWater ? fmtMl(metric.goal) : `${metric.goal.toLocaleString()} ${metric.unit}`;
  const left = isWater ? fmtMl(metric.remaining) : `${metric.remaining.toLocaleString()} ${metric.unit}`;

  // little pop on the badge when a quest completes
  const pop = useRef(new Animated.Value(done ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(pop, { toValue: done ? 1 : 0, tension: 140, friction: 6, useNativeDriver: true }).start();
  }, [done, pop]);

  return (
    <ClayCard
      tint="cloud"
      depth="md"
      radius={26}
      padding={14}
      onPress={onPress}
      accessibilityLabel={`${quest.title}: ${format(metric.current)} of ${goal}`}
      contentStyle={styles.row}
    >
      <View style={styles.mascot}>
        <Companion id={quest.companion} mood={moodFor(metric.percentage, metric.current)} size={60} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <ClayTitle size={16}>
            {metric.icon} {quest.title}
          </ClayTitle>
          {done ? (
            <Animated.View style={[styles.doneBadge, { transform: [{ scale: pop }] }]}>
              <Text style={styles.doneText}>✓ Done</Text>
            </Animated.View>
          ) : (
            <Text style={styles.pct}>{metric.percentage}%</Text>
          )}
        </View>
        <ClayLabel numberOfLines={2} style={styles.line}>
          {quest.line(metric, left)}
        </ClayLabel>
        <ClayProgressBar percentage={metric.percentage} tint="pulse" height={10} />
        <View style={styles.amountRow}>
          <CountUp value={metric.current} format={format} style={styles.amount} />
          <Text style={styles.goal}> / {goal}</Text>
        </View>
      </View>

      <ClayCard
        tint="pulse"
        depth="sm"
        radius={18}
        padding={0}
        glow="soft"
        onPress={onQuickAdd}
        accessibilityLabel={quickLabel}
        contentStyle={styles.plus}
      >
        <Text style={styles.plusText}>+</Text>
      </ClayCard>
    </ClayCard>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mascot: {
    width: 64,
    alignItems: 'center',
  },
  body: {
    flex: 1,
    gap: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pct: {
    fontFamily: typography.fonts.display,
    fontSize: 14,
    color: ACCENT,
  },
  doneBadge: {
    backgroundColor: clayTints.pulse.soft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  doneText: {
    fontFamily: typography.fonts.display,
    fontSize: 12,
    color: ACCENT,
  },
  line: {
    fontSize: 12,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amount: {
    fontFamily: typography.fonts.display,
    fontSize: 15,
    color: clay.ink.primary,
  },
  goal: {
    fontFamily: typography.fonts.displayMedium,
    fontSize: 12,
    color: clay.ink.tertiary,
  },
  plus: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontFamily: typography.fonts.display,
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: -2,
  },
});
