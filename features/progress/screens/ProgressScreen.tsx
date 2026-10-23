/**
 * @file ProgressScreen.tsx
 * @description "Stats" tab – streak, weight trend, 7-day summaries and badges.
 */

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BounceIn,
  ClayBars,
  ClayButton,
  ClayCard,
  ClayChip,
  ClayIcon,
  ClayInput,
  ClayLabel,
  ClayScreen,
  ClaySectionHeader,
  ClaySheet,
  ClayTitle,
  Sphere,
} from '../../../components/clay';
import { clay, clayTints, ClayTint } from '../../../theme/clay';
import { typography } from '../../../theme/typography';
import { useToast } from '../../../hooks/useToast';
import { useHaptics } from '../../../hooks/useHaptics';
import { weekdayInitial } from '../../../utils/date';
import { useProgress } from '../hooks/useProgress';
import { WeightChart } from '../components/WeightChart';
import type { DayTotals } from '../types';

type MetricKey = 'calories' | 'protein' | 'waterMl' | 'workoutMinutes';

const METRICS: { key: MetricKey; label: string; emoji: string; tint: ClayTint; unit: string }[] = [
  { key: 'calories', label: 'Calories', emoji: '🍽️', tint: 'blaze', unit: 'kcal' },
  { key: 'protein', label: 'Protein', emoji: '🥚', tint: 'eggsy', unit: 'g' },
  { key: 'waterMl', label: 'Water', emoji: '💧', tint: 'droppy', unit: 'ml' },
  { key: 'workoutMinutes', label: 'Move', emoji: '🔥', tint: 'pulse', unit: 'min' },
];

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// ---------------------------------------------------------------------------
// Weight sheet
// ---------------------------------------------------------------------------

const WeightSheet: React.FC<{
  visible: boolean;
  initial: number;
  onClose: () => void;
  onSave: (kg: number) => Promise<void>;
}> = ({ visible, initial, onClose, onSave }) => {
  const [value, setValue] = useState(initial.toFixed(1));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) setValue(initial.toFixed(1));
  }, [visible, initial]);

  const num = parseFloat(value.replace(',', '.'));
  const valid = !isNaN(num) && num >= 20 && num <= 400;
  const step = (d: number) => setValue((Math.max(20, (valid ? num : initial) + d)).toFixed(1));

  return (
    <ClaySheet visible={visible} onClose={onClose} title="Today's weigh-in" emoji="⚖️">
      <View style={styles.stepRow}>
        <ClayButton label="−" tint="cloud" onPress={() => step(-0.1)} accessibilityLabel="Decrease by 0.1 kg" />
        <View style={{ flex: 1 }}>
          <ClayInput
            big
            tint="luna"
            value={value}
            onChangeText={(v) => setValue(v.replace(/[^0-9.,]/g, ''))}
            keyboardType="decimal-pad"
            maxLength={5}
            suffix="kg"
            accessibilityLabel="Weight in kilograms"
          />
        </View>
        <ClayButton label="+" tint="cloud" onPress={() => step(0.1)} accessibilityLabel="Increase by 0.1 kg" />
      </View>
      <ClayLabel style={{ textAlign: 'center' }}>
        Tip: weigh in at the same time each morning for the smoothest trend 🌙
      </ClayLabel>
      <ClayButton
        label="Save weight"
        icon="✅"
        tint="luna"
        size="lg"
        fullWidth
        disabled={!valid}
        loading={saving}
        onPress={async () => {
          setSaving(true);
          try {
            await onSave(Math.round(num * 10) / 10);
            onClose();
          } finally {
            setSaving(false);
          }
        }}
      />
    </ClaySheet>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function ProgressScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ log?: string }>();
  const toast = useToast();
  const haptics = useHaptics();
  const { isLoading, profile, weights, week, streak, badges, currentWeight, startWeight, targetWeight, logWeight, refresh } =
    useProgress();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [metric, setMetric] = useState<MetricKey>('calories');

  useEffect(() => {
    if (params.log) setSheetOpen(true);
  }, [params.log]);

  const m = METRICS.find((x) => x.key === metric)!;
  const goalFor: Record<MetricKey, number | undefined> = {
    calories: profile?.calorieGoal,
    protein: profile?.proteinGoalGrams,
    waterMl: profile?.waterGoalMl,
    workoutMinutes: 30,
  };
  const weekAvg = week.length ? Math.round(week.reduce((s, d: DayTotals) => s + d[metric], 0) / week.length) : 0;

  const change = Math.round((currentWeight - startWeight) * 10) / 10;
  const toGo = Math.round(Math.abs(currentWeight - targetWeight) * 10) / 10;
  const unlocked = badges.filter((b) => b.unlocked).length;

  return (
    <ClayScreen
      title="Stats"
      subtitle="Look how far you've come ✨"
      companionId="luna"
      companionMood={streak.current >= 3 ? 'celebrate' : 'wave'}
      refreshing={isLoading}
      onRefresh={refresh}
      headerRight={
        <Pressable onPress={() => router.navigate('/(tabs)/profile')} accessibilityRole="button" accessibilityLabel="Profile">
          <ClayIcon emoji="👤" tint="cloud" size={44} />
        </Pressable>
      }
      overlay={
        <WeightSheet
          visible={sheetOpen}
          initial={currentWeight}
          onClose={() => setSheetOpen(false)}
          onSave={async (kg) => {
            await logWeight(kg);
            haptics.success();
            toast.showSuccess(`Weight saved: ${kg} kg ⚖️`, 'luna');
          }}
        />
      }
    >
      {/* Streak */}
      <BounceIn>
        <ClayCard tint="bubblegum" depth="lg" radius={32} padding={20} glow="strong">
          <View style={styles.streakTop}>
            <Text style={styles.streakFlame}>🔥</Text>
            <View style={{ flex: 1 }}>
              <ClayTitle size={40} color="#FFFFFF">{streak.current}</ClayTitle>
              <Text style={styles.streakLabel}>day streak · best {streak.longest}</Text>
            </View>
          </View>
          <View style={styles.weekDots}>
            {streak.weeklyActivity.map((active, i) => (
              <View key={i} style={styles.weekDot}>
                <Sphere size={30} color={active ? '#FFD15C' : '#FFFFFF'} opacity={active ? 1 : 0.45} />
                <Text style={styles.weekDotLabel}>{DAY_LETTERS[i]}</Text>
              </View>
            ))}
          </View>
        </ClayCard>
      </BounceIn>

      {/* Weight */}
      <BounceIn delay={80}>
        <ClaySectionHeader title="Weight journey" subtitle={weights.length ? `${weights.length} weigh-ins` : 'No weigh-ins yet'} />
        <ClayCard tint="cloud" depth="md" radius={28} padding={18} contentStyle={{ gap: 14 }}>
          <View style={styles.weightStats}>
            <View style={styles.weightStat}>
              <ClayLabel>Now</ClayLabel>
              <ClayTitle size={24} color={clayTints.luna.accent}>{currentWeight.toFixed(1)}</ClayTitle>
            </View>
            <View style={styles.weightStat}>
              <ClayLabel>Change</ClayLabel>
              <ClayTitle size={24}>{change > 0 ? `+${change}` : change}</ClayTitle>
            </View>
            <View style={styles.weightStat}>
              <ClayLabel>To goal</ClayLabel>
              <ClayTitle size={24} color={clayTints.brocco.accent}>{toGo === 0 ? '🎉' : toGo}</ClayTitle>
            </View>
          </View>
          <WeightChart logs={weights} target={targetWeight} />
          <ClayButton label="Log weight" icon="⚖️" tint="luna" fullWidth onPress={() => setSheetOpen(true)} />
        </ClayCard>
      </BounceIn>

      {/* Week */}
      <BounceIn delay={140}>
        <ClaySectionHeader title="Last 7 days" subtitle={`Average ${weekAvg.toLocaleString()} ${m.unit} / day`} />
        <View style={styles.chips}>
          {METRICS.map((x) => (
            <ClayChip
              key={x.key}
              label={x.label}
              emoji={x.emoji}
              tint={x.tint}
              selected={x.key === metric}
              onPress={() => setMetric(x.key)}
            />
          ))}
        </View>
        <ClayCard tint="cloud" depth="md" radius={28} padding={18} style={{ marginTop: 12 }}>
          <ClayBars
            tint={m.tint}
            goal={goalFor[metric]}
            formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v)))}
            data={week.map((d) => ({ label: weekdayInitial(d.day), value: d[metric] }))}
          />
        </ClayCard>
      </BounceIn>

      {/* Badges */}
      <BounceIn delay={200}>
        <ClaySectionHeader title="Badges" subtitle={`${unlocked} of ${badges.length} unlocked`} />
        <View style={styles.badgeGrid}>
          {badges.map((b) => (
            <ClayCard
              key={b.id}
              tint={b.unlocked ? b.tint : 'cloud'}
              depth="md"
              radius={24}
              padding={0}
              glow={b.unlocked ? 'medium' : 'none'}
              style={styles.badge}
              contentStyle={[styles.badgeFace, !b.unlocked && { opacity: 0.6 }]}
              accessibilityLabel={`${b.title}: ${b.unlocked ? 'unlocked' : b.hint}`}
            >
              <Text style={styles.badgeEmoji}>{b.unlocked ? b.emoji : '🔒'}</Text>
              <Text
                numberOfLines={1}
                style={[styles.badgeTitle, { color: b.unlocked ? clayTints[b.tint].ink : clay.ink.secondary }]}
              >
                {b.title}
              </Text>
              {!b.unlocked && (
                <Text numberOfLines={1} style={styles.badgeHint}>
                  {b.hint}
                </Text>
              )}
            </ClayCard>
          ))}
        </View>
      </BounceIn>
    </ClayScreen>
  );
}

const styles = StyleSheet.create({
  streakTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakFlame: {
    fontSize: 52,
  },
  streakLabel: {
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: -4,
  },
  weekDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  weekDot: {
    alignItems: 'center',
    gap: 2,
  },
  weekDotLabel: {
    fontFamily: typography.fonts.display,
    fontSize: 11,
    color: '#FFFFFF',
  },
  weightStats: {
    flexDirection: 'row',
  },
  weightStat: {
    flex: 1,
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    width: '30%',
    flexGrow: 1,
  },
  badgeFace: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    gap: 2,
  },
  badgeEmoji: {
    fontSize: 30,
  },
  badgeTitle: {
    fontFamily: typography.fonts.display,
    fontSize: 13,
  },
  badgeHint: {
    fontFamily: typography.fonts.displayMedium,
    fontSize: 10,
    color: clay.ink.tertiary,
  },
});
