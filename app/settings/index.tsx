import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { GlassCard, Button, FloatingModal } from '../../components/ui';
import { Companion } from '../../components/mascot/Companion';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useToast } from '../../hooks/useToast';
import { SettingsRepository, StorageService } from '../../services';
import type { AppSettings } from '../../types/models';
import { useOnboardingStore } from '../../store/onboardingStore';

export default function SettingsScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const toast = useToast();
  const { mode, setMode } = useTheme();
  const onboardingStore = useOnboardingStore();

  const [settings, setSettings] = useState<AppSettings>({
    themeMode: mode,
    enableHaptics: true,
    enableNotifications: true,
    enableSound: true,
    unitSystem: 'metric',
    waterRemindersEnabled: true,
    workoutRemindersEnabled: true,
  });

  const [isResetConfirming, setIsResetConfirming] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    SettingsRepository.get().then((st) => {
      setSettings(st);
    });
  }, []);

  const updateSetting = async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    haptics.light();
    const updated = await SettingsRepository.update({ [key]: value });
    setSettings(updated);

    if (key === 'themeMode') {
      setMode(value as any);
    }
    toast.showSuccess('Setting updated');
  };

  const handleResetLocalData = async () => {
    haptics.warning();
    setClearing(true);
    try {
      await StorageService.clearAll();
      onboardingStore.resetOnboarding();
      setIsResetConfirming(false);
      toast.showInfo('All local data cleared successfully!');
      router.replace('/onboarding');
    } catch (err) {
      console.error('[Settings] Clear data error:', err);
      toast.showError('Failed to clear local data');
    } finally {
      setClearing(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header with Back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Theme Settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Appearance & Theme</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={styles.settingLabel}>Theme Preference</Text>
          <View style={styles.themeOptionsRow}>
            {(['light', 'dark', 'system'] as const).map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => updateSetting('themeMode', m)}
                style={[styles.themeOptionBtn, mode === m && styles.themeOptionActive]}
              >
                <Text style={[styles.themeOptionText, mode === m && styles.themeOptionTextActive]}>
                  {m === 'light' ? '☀️ Light' : m === 'dark' ? '🌙 Dark' : '💻 System'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Units & Preferences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Units & Preferences</Text>
        </View>

        <GlassCard style={styles.card}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Unit System</Text>
              <Text style={styles.settingSub}>Choose between Metric (kg, cm) and Imperial (lbs, in)</Text>
            </View>
            <View style={styles.unitToggleRow}>
              <TouchableOpacity
                onPress={() => updateSetting('unitSystem', 'metric')}
                style={[styles.unitBtn, settings.unitSystem === 'metric' && styles.unitBtnActive]}
              >
                <Text style={[styles.unitBtnText, settings.unitSystem === 'metric' && styles.unitBtnTextActive]}>
                  Metric
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateSetting('unitSystem', 'imperial')}
                style={[styles.unitBtn, settings.unitSystem === 'imperial' && styles.unitBtnActive]}
              >
                <Text style={[styles.unitBtnText, settings.unitSystem === 'imperial' && styles.unitBtnTextActive]}>
                  Imperial
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Notifications & Reminders</Text>
              <Text style={styles.settingSub}>Receive daily reminders for water intake & workout logs</Text>
            </View>
            <Switch
              value={settings.enableNotifications}
              onValueChange={(val) => updateSetting('enableNotifications', val)}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Haptic Feedback</Text>
              <Text style={styles.settingSub}>Vibrate device on button presses & log entries</Text>
            </View>
            <Switch
              value={settings.enableHaptics}
              onValueChange={(val) => updateSetting('enableHaptics', val)}
              trackColor={{ false: colors.gray300, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </GlassCard>

        {/* Data & Storage */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Local Data Management</Text>
        </View>

        <GlassCard style={styles.card}>
          <Text style={[styles.settingTitle, { color: '#991B1B' }]}>Reset All Local Data</Text>
          <Text style={[styles.settingSub, { color: '#B91C1C', marginBottom: 12 }]}>
            Permanently clear stored food, water, workout, weight logs, and profile settings from device storage.
          </Text>
          <Button
            variant="secondary"
            label="🗑️ Reset Local Data"
            onPress={() => setIsResetConfirming(true)}
            style={{ backgroundColor: '#FEE2E2' }}
            labelStyle={{ color: '#991B1B' }}
          />
        </GlassCard>

        {/* About PulseFit */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About PulseFit</Text>
        </View>

        <GlassCard style={styles.aboutCard}>
          <Companion id="pulse" mood="wave" size="md" />
          <Text style={styles.aboutTitle}>PulseFit MVP v1.0.0</Text>
          <Text style={styles.aboutDesc}>
            A personal, offline-first fitness companion built with Expo SDK 54, React Native, TypeScript, and AsyncStorage.
          </Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>⚡ Offline First</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>🔒 Private & Local</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>🚀 Supabase-Ready</Text></View>
          </View>
        </GlassCard>
      </ScrollView>

      {/* Reset Confirmation Modal */}
      <FloatingModal
        visible={isResetConfirming}
        onClose={() => setIsResetConfirming(false)}
        title="⚠️ Reset All Data?"
      >
        <View style={styles.confirmContent}>
          <Text style={styles.confirmText}>
            Are you sure you want to delete all local data? This action cannot be undone. You will be taken back to onboarding.
          </Text>
          <View style={styles.actions}>
            <Button
              variant="secondary"
              label="Cancel"
              onPress={() => setIsResetConfirming(false)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              variant="secondary"
              label="Yes, Delete All"
              onPress={handleResetLocalData}
              loading={clearing}
              style={{ flex: 1, backgroundColor: '#DC2626' }}
              labelStyle={{ color: '#FFFFFF' }}
            />
          </View>
        </View>
      </FloatingModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray900,
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 10,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.gray100,
    alignItems: 'center',
  },
  themeOptionActive: {
    backgroundColor: colors.primary,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray700,
  },
  themeOptionTextActive: {
    color: '#ffffff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
  },
  settingSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
    maxWidth: 220,
  },
  unitToggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: radius.md,
    padding: 2,
  },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  unitBtnActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  unitBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
  },
  unitBtnTextActive: {
    color: colors.gray900,
    fontWeight: '800',
  },
  aboutCard: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray900,
    marginTop: 10,
    marginBottom: 6,
  },
  aboutDesc: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gray700,
  },
  confirmContent: {
    paddingVertical: 8,
  },
  confirmText: {
    fontSize: 14,
    color: colors.gray700,
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
});
