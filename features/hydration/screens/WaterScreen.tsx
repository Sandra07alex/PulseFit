/**
 * @file WaterScreen.tsx
 * @description Offline water tracking screen – clay 3D edition.
 *
 * Features:
 *  - 3D water jar that fills as you drink
 *  - Quick-add tiles: 250 / 500 / 750 / 1000 ml
 *  - Custom amount bottom sheet
 *  - Today's log history with delete
 *  - Sleepy Droppy empty state
 */

import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BounceIn,
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
} from '../../../components/clay';
import { Companion } from '../../../components/mascot/Companion';
import { WaterJar } from '../components/WaterJar';
import { useWater } from '../hooks/useWater';
import { useHaptics } from '../../../hooks/useHaptics';
import { useToast } from '../../../hooks/useToast';
import { confirmAction } from '../../../utils/confirm';
import { shortTime } from '../../../utils/date';
import { clayTints } from '../../../theme/clay';
import { typography } from '../../../theme/typography';
import type { WaterLog } from '../../../types/models';

const DROPPY = clayTints.droppy;

const QUICK_AMOUNTS = [
  { ml: 250, emoji: '🥛', label: 'Glass' },
  { ml: 500, emoji: '🥤', label: 'Bottle' },
  { ml: 750, emoji: '🍶', label: 'Big' },
  { ml: 1000, emoji: '🫙', label: 'Jug' },
] as const;

const PRESETS = [100, 200, 350, 600];

const fmt = (ml: number) => (ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`);

// ---------------------------------------------------------------------------
// Custom amount sheet
// ---------------------------------------------------------------------------

const CustomAmountSheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  onConfirm: (ml: number) => Promise<void>;
}> = ({ visible, onClose, onConfirm }) => {
  const [input, setInput] = useState('');
  const value = parseInt(input, 10) || 0;
  const valid = value >= 1 && value <= 5000;

  return (
    <ClaySheet
      visible={visible}
      onClose={() => {
        setInput('');
        onClose();
      }}
      title="Custom amount"
      emoji="💧"
    >
      <ClayInput
        big
        tint="droppy"
        value={input}
        onChangeText={(v) => setInput(v.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        placeholder="350"
        maxLength={4}
        suffix="ml"
        autoFocus
        accessibilityLabel="Custom water amount in millilitres"
      />
      <View style={styles.presets}>
        {PRESETS.map((v) => (
          <ClayChip key={v} label={`${v} ml`} tint="droppy" selected={value === v} onPress={() => setInput(String(v))} />
        ))}
      </View>
      {input !== '' && !valid ? (
        <ClayLabel style={{ textAlign: 'center', color: clayTints.blaze.accent }}>
          Pick something between 1 and 5000 ml
        </ClayLabel>
      ) : null}
      <ClayButton
        label="Add water"
        icon="💧"
        tint="droppy"
        size="lg"
        fullWidth
        disabled={!valid}
        onPress={async () => {
          await onConfirm(value);
          setInput('');
          onClose();
        }}
      />
    </ClaySheet>
  );
};

// ---------------------------------------------------------------------------
// Log row
// ---------------------------------------------------------------------------

const LogRow: React.FC<{ log: WaterLog; onDelete: () => void }> = ({ log, onDelete }) => (
  <ClayCard tint="cloud" depth="sm" radius={22} padding={12} glow="soft" contentStyle={styles.row}>
    <ClayIcon emoji="💧" tint="droppy" size={40} />
    <View style={{ flex: 1 }}>
      <ClayTitle size={17} color={DROPPY.accent}>{fmt(log.amountMl)}</ClayTitle>
      <ClayLabel>{shortTime(log.loggedAt)}</ClayLabel>
    </View>
    <Pressable onPress={onDelete} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Delete ${fmt(log.amountMl)} log`}>
      <Text style={styles.trash}>🗑️</Text>
    </Pressable>
  </ClayCard>
);

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export function WaterScreen() {
  const haptics = useHaptics();
  const toast = useToast();
  const { logs, totalMl, goalMl, remainingMl, percentage, isLoading, addWater, removeLog, refresh } = useWater();
  const [sheetOpen, setSheetOpen] = useState(false);

  const done = remainingMl === 0 && totalMl > 0;

  const handleAdd = useCallback(
    async (ml: number) => {
      haptics.light();
      await addWater(ml);
      if (totalMl < goalMl && totalMl + ml >= goalMl) {
        haptics.success();
        toast.showSuccess('Goal reached! Droppy is doing a happy splash 🎉', 'droppy');
      }
    },
    [addWater, haptics, toast, totalMl, goalMl]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      // confirmAction falls back to window.confirm on web, where Alert buttons do nothing
      if (await confirmAction('Delete Log', 'Remove this water entry?')) {
        await removeLog(id);
      }
    },
    [removeLog]
  );

  return (
    <ClayScreen
      title="Hydration"
      subtitle={done ? 'Fully charged! 💙' : 'Stay hydrated, stay sharp'}
      companionId="droppy"
      companionMood={done ? 'celebrate' : percentage >= 50 ? 'wave' : 'idle'}
      refreshing={isLoading}
      onRefresh={refresh}
      overlay={<CustomAmountSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} onConfirm={handleAdd} />}
    >
      {/* Hero */}
      <BounceIn>
        <ClayCard tint="cloud" depth="lg" radius={32} padding={20} glow="strong" contentStyle={styles.hero}>
          <WaterJar percentage={percentage} />
          <View style={styles.heroStats}>
            <ClayLabel>Today's intake</ClayLabel>
            <ClayTitle size={38} color={DROPPY.accent}>{fmt(totalMl)}</ClayTitle>
            <ClayLabel style={{ marginTop: -4 }}>of {fmt(goalMl)} goal</ClayLabel>
            <ClayCard tint={done ? 'brocco' : 'droppy'} depth="sm" radius={18} padding={10} glow="soft" style={{ marginTop: 12 }}>
              <Text style={styles.pillValue}>{done ? '🎉 Done!' : `${fmt(remainingMl)} to go`}</Text>
              <Text style={styles.pillLabel}>
                {percentage}% · {Math.floor(totalMl / 250)} glasses
              </Text>
            </ClayCard>
          </View>
        </ClayCard>
      </BounceIn>

      {/* Quick add */}
      <BounceIn delay={80}>
        <ClaySectionHeader title="Quick add" subtitle="Tap to pour 💧" />
        <View style={styles.grid}>
          {QUICK_AMOUNTS.map((q) => (
            <ClayCard
              key={q.ml}
              tint="droppy"
              depth="md"
              radius={22}
              padding={0}
              glow="soft"
              onPress={() => handleAdd(q.ml)}
              accessibilityLabel={`Add ${q.ml} millilitres`}
              style={styles.tile}
              contentStyle={styles.tileFace}
            >
              <Text style={styles.tileEmoji}>{q.emoji}</Text>
              <Text style={styles.tileAmount}>{fmt(q.ml)}</Text>
              <Text style={styles.tileLabel}>{q.label}</Text>
            </ClayCard>
          ))}
        </View>
        <ClayButton
          label="Custom amount"
          icon="✏️"
          tint="cloud"
          fullWidth
          style={{ marginTop: 14 }}
          labelStyle={{ color: DROPPY.accent }}
          onPress={() => setSheetOpen(true)}
        />
      </BounceIn>

      {/* Log */}
      <BounceIn delay={140}>
        <ClaySectionHeader
          title="Today's log"
          subtitle={logs.length ? `${logs.length} entr${logs.length === 1 ? 'y' : 'ies'}` : undefined}
        />
        {logs.length === 0 ? (
          <ClayCard tint="cloud" depth="md" radius={28} padding={24} contentStyle={styles.empty}>
            <Companion id="droppy" mood="sleep" size={84} />
            <ClayTitle size={18}>No water logged yet</ClayTitle>
            <ClayLabel style={{ textAlign: 'center' }}>Tap a glass above to wake Droppy up!</ClayLabel>
          </ClayCard>
        ) : (
          <View style={{ gap: 10 }}>
            {logs.map((log) => (
              <LogRow key={log.id} log={log} onDelete={() => handleDelete(log.id)} />
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
  },
  pillValue: {
    fontFamily: typography.fonts.display,
    fontSize: 17,
    color: '#FFFFFF',
  },
  pillLabel: {
    fontFamily: typography.fonts.displayMedium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.92)',
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
  },
  tileFace: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 2,
  },
  tileEmoji: {
    fontSize: 26,
  },
  tileAmount: {
    fontFamily: typography.fonts.display,
    fontSize: 16,
    color: '#FFFFFF',
  },
  tileLabel: {
    fontFamily: typography.fonts.displayMedium,
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
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
