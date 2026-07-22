import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ReminderOption } from '../../../store/onboardingStore';
import { Companion } from '../../../components/mascot/Companion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { shadows } from '../../../theme/shadows';

export interface ReminderPickerProps {
  selectedPreset: ReminderOption;
  timeString: string;
  onSelectPreset: (preset: ReminderOption, time: string) => void;
}

const PRESETS: { id: ReminderOption; label: string; time: string; icon: string }[] = [
  { id: 'morning', label: 'Morning 🌅', time: '08:00 AM', icon: '☀️' },
  { id: 'afternoon', label: 'Afternoon 🌤️', time: '01:00 PM', icon: '🔋' },
  { id: 'evening', label: 'Evening 🌙', time: '07:00 PM', icon: '🌆' },
];

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
  selectedPreset,
  timeString,
  onSelectPreset,
}) => {
  return (
    <View style={styles.container}>
      {/* Preset Buttons */}
      <View style={styles.presetGrid}>
        {PRESETS.map((p) => {
          const isSelected = selectedPreset === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.88}
              onPress={() => onSelectPreset(p.id, p.time)}
              style={[
                styles.presetCard,
                isSelected ? styles.presetSelected : styles.presetDefault,
                isSelected && shadows.sm,
              ]}
            >
              <Text style={styles.presetIcon}>{p.icon}</Text>
              <Text style={[styles.presetTitle, isSelected && styles.presetTitleSelected]}>{p.label}</Text>
              <Text style={[styles.presetTime, isSelected && styles.presetTimeSelected]}>{p.time}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live Notification Preview Card */}
      <View style={[styles.notificationPreview, shadows.md]}>
        <View style={styles.previewHeader}>
          <Companion id="pulse" mood="wave" size="sm" animated={true} />
          <View style={styles.previewHeaderRight}>
            <Text style={styles.appName}>PulseFit Notification</Text>
            <Text style={styles.timeTag}>{timeString}</Text>
          </View>
        </View>

        <Text style={styles.previewTitle}>Time to energize your body! ⚡</Text>
        <Text style={styles.previewBody}>
          Hey Champion! ❤️ Pulse coach is waiting to log your water & daily workout.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  presetGrid: {
    gap: 12,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: radius.card,
    borderWidth: 2,
    gap: 12,
  },
  presetDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.gray200,
  },
  presetSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  presetIcon: {
    fontSize: 22,
  },
  presetTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray900,
  },
  presetTitleSelected: {
    color: colors.primary,
  },
  presetTime: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.gray500,
  },
  presetTimeSelected: {
    color: colors.primary,
  },
  notificationPreview: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glass.borderLight,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  previewHeaderRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  timeTag: {
    fontSize: 11,
    color: colors.gray400,
    fontWeight: '600',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 4,
  },
  previewBody: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 18,
  },
});
