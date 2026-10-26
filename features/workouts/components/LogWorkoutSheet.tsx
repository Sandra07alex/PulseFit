import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ClayButton, ClayChip, ClayInput, ClayLabel, ClaySheet } from '../../../components/clay';
import { clayTints } from '../../../theme/clay';
import { typography } from '../../../theme/typography';
import {
  DURATION_PRESETS,
  INTENSITY_OPTIONS,
  WORKOUT_PRESETS,
  WorkoutPreset,
} from '../constants';
import type { NewWorkout } from '../hooks/useWorkouts';
import type { WorkoutIntensity } from '../../../types/models';

/** The Move screen uses a single coral accent */
const ACCENT_TINT = 'blaze' as const;

export interface LogWorkoutSheetProps {
  visible: boolean;
  initialPreset?: WorkoutPreset;
  onClose: () => void;
  onSave: (w: NewWorkout) => Promise<void> | void;
  estimateCalories: (w: Pick<NewWorkout, 'category' | 'durationMinutes' | 'intensity'>) => number;
}

export const LogWorkoutSheet: React.FC<LogWorkoutSheetProps> = ({
  visible,
  initialPreset,
  onClose,
  onSave,
  estimateCalories,
}) => {
  const [preset, setPreset] = useState<WorkoutPreset>(initialPreset ?? WORKOUT_PRESETS[0]);
  const [minutes, setMinutes] = useState('30');
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Moderate');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setPreset(initialPreset ?? WORKOUT_PRESETS[0]);
      setMinutes('30');
      setIntensity('Moderate');
    }
  }, [visible, initialPreset]);

  const duration = Math.min(600, Math.max(0, parseInt(minutes, 10) || 0));
  const kcal = duration > 0 ? estimateCalories({ category: preset.category, durationMinutes: duration, intensity }) : 0;
  const accent = clayTints[ACCENT_TINT].accent;

  const save = async () => {
    if (duration <= 0) return;
    setSaving(true);
    try {
      await onSave({ title: preset.label, category: preset.category, durationMinutes: duration, intensity });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <ClaySheet visible={visible} onClose={onClose} title="Log a workout" emoji="🔥">
      <View style={styles.block}>
        <ClayLabel>What did you do?</ClayLabel>
        <View style={styles.wrap}>
          {WORKOUT_PRESETS.map((p) => (
            <ClayChip
              key={p.id}
              label={p.label}
              emoji={p.emoji}
              tint={ACCENT_TINT}
              selected={p.id === preset.id}
              onPress={() => setPreset(p)}
            />
          ))}
        </View>
      </View>

      <View style={styles.block}>
        <ClayLabel>How long?</ClayLabel>
        <View style={styles.wrap}>
          {DURATION_PRESETS.map((m) => (
            <ClayChip
              key={m}
              label={`${m} min`}
              tint={ACCENT_TINT}
              selected={duration === m}
              onPress={() => setMinutes(String(m))}
            />
          ))}
        </View>
        <ClayInput
          value={minutes}
          onChangeText={(v) => setMinutes(v.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={3}
          suffix="minutes"
          tint={ACCENT_TINT}
          accessibilityLabel="Workout duration in minutes"
        />
      </View>

      <View style={styles.block}>
        <ClayLabel>How did it feel?</ClayLabel>
        <View style={styles.wrap}>
          {INTENSITY_OPTIONS.map((o) => (
            <ClayChip
              key={o.value}
              label={o.label}
              emoji={o.emoji}
              tint={ACCENT_TINT}
              selected={intensity === o.value}
              onPress={() => setIntensity(o.value)}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.estimate, { color: accent }]}>
        ≈ {kcal} kcal burned {preset.emoji}
      </Text>

      <ClayButton
        label="Save workout"
        icon="✅"
        tint={ACCENT_TINT}
        size="lg"
        fullWidth
        loading={saving}
        disabled={duration <= 0}
        onPress={save}
      />
    </ClaySheet>
  );
};

const styles = StyleSheet.create({
  block: {
    gap: 8,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  estimate: {
    textAlign: 'center',
    fontFamily: typography.fonts.display,
    fontSize: 18,
  },
});
