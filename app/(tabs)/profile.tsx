import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TextInput } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppShell } from '../../components/layout';
import { GlassCard, Button, FloatingModal } from '../../components/ui';
import { Companion } from '../../components/mascot/Companion';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { LocalProfileService } from '../../services';
import type { UserProfile } from '../../types/models';
import { useToast } from '../../hooks/useToast';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useHaptics } from '../../hooks/useHaptics';

export default function ProfileScreen() {
  const router = useRouter();
  const haptics = useHaptics();
  const toast = useToast();
  const onboardingStore = useOnboardingStore();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isResetConfirming, setIsResetConfirming] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('26');
  const [editHeight, setEditHeight] = useState('175');
  const [editWeight, setEditWeight] = useState('70');
  const [editTargetWeight, setEditTargetWeight] = useState('68');
  const [editGoal, setEditGoal] = useState('stay_healthy');
  const [editActivity, setEditActivity] = useState('moderately_active');
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const p = await LocalProfileService.getProfile();
      if (p) {
        setProfile(p);
        setEditName(p.name);
        setEditAge(String(p.age));
        setEditHeight(String(p.heightCm));
        setEditWeight(String(p.weightKg));
        setEditTargetWeight(String(p.targetWeightKg));
        setEditGoal(p.goal);
        setEditActivity(p.activityLevel);
      }
    } catch (err) {
      console.error('[ProfileScreen] Error loading profile:', err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleSaveProfile = async () => {
    haptics.medium();
    setSaving(true);
    try {
      const updated = await LocalProfileService.updateProfile({
        name: editName.trim() || 'Athlete',
        age: parseInt(editAge, 10) || 26,
        heightCm: parseFloat(editHeight) || 175,
        weightKg: parseFloat(editWeight) || 70,
        targetWeightKg: parseFloat(editTargetWeight) || 68,
        goal: editGoal,
        activityLevel: editActivity as UserProfile['activityLevel'],
      });
      if (updated) {
        setProfile(updated);
        toast.showSuccess('Profile updated successfully!');
      }
      setIsEditing(false);
    } catch (err) {
      console.error('[ProfileScreen] Save profile error:', err);
      toast.showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResetOnboarding = async () => {
    haptics.success();
    try {
      await LocalProfileService.deleteProfile();
      onboardingStore.resetOnboarding();
      setIsResetConfirming(false);
      toast.showInfo('Onboarding reset. Starting fresh!');
      router.replace('/onboarding');
    } catch (err) {
      console.error('[ProfileScreen] Reset error:', err);
      toast.showError('Failed to reset onboarding');
    }
  };

  const formatGoal = (g?: string) => {
    switch (g) {
      case 'lose_fat':
        return '🔥 Lose Fat';
      case 'build_muscle':
        return '💪 Build Muscle';
      case 'improve_fitness':
        return '⚡ Improve Fitness';
      case 'increase_endurance':
        return '🏃 Increase Endurance';
      default:
        return '✨ Stay Healthy';
    }
  };

  const formatActivity = (act?: string) => {
    switch (act) {
      case 'sedentary':
        return '🛋️ Sedentary';
      case 'lightly_active':
        return '🚶 Lightly Active';
      case 'very_active':
        return '🏃 Very Active';
      case 'athlete':
        return '💥 Athlete';
      default:
        return '🚴 Moderately Active';
    }
  };

  return (
    <AppShell
      headerProps={{
        title: 'Profile & Recovery',
        subtitle: 'Manage your biometrics & settings',
        companionId: 'luna',
        companionMood: 'idle',
        greeting: '🌙 Luna Guide',
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <GlassCard style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <Companion id="pulse" mood="celebrate" size="lg" />
            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>{profile?.name || 'Pulse Athlete'}</Text>
              <Text style={styles.goalTag}>{formatGoal(profile?.goal)}</Text>
              <Text style={styles.activityTag}>{formatActivity(profile?.activityLevel)}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button
              variant="secondary"
              label="✏️ Edit Profile"
              onPress={() => setIsEditing(true)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              variant="outline"
              label="⚙️ Settings"
              onPress={() => router.push('/settings')}
              style={{ flex: 1 }}
            />
          </View>
        </GlassCard>

        {/* Biometrics Summary Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Biometrics & Targets</Text>
        </View>

        <View style={styles.bioGrid}>
          <GlassCard style={styles.bioTile}>
            <Text style={styles.bioIcon}>📏</Text>
            <Text style={styles.bioLabel}>Height</Text>
            <Text style={styles.bioVal}>{profile?.heightCm || 175} cm</Text>
          </GlassCard>

          <GlassCard style={styles.bioTile}>
            <Text style={styles.bioIcon}>⚖️</Text>
            <Text style={styles.bioLabel}>Current Weight</Text>
            <Text style={styles.bioVal}>{profile?.weightKg || 70} kg</Text>
          </GlassCard>

          <GlassCard style={styles.bioTile}>
            <Text style={styles.bioIcon}>🎯</Text>
            <Text style={styles.bioLabel}>Target Weight</Text>
            <Text style={styles.bioVal}>{profile?.targetWeightKg || 68} kg</Text>
          </GlassCard>

          <GlassCard style={styles.bioTile}>
            <Text style={styles.bioIcon}>🎂</Text>
            <Text style={styles.bioLabel}>Age</Text>
            <Text style={styles.bioVal}>{profile?.age || 26} yrs</Text>
          </GlassCard>
        </View>

        {/* Daily Goals Summary */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Targets</Text>
        </View>

        <GlassCard style={styles.targetsCard}>
          <View style={styles.targetRow}>
            <Text style={styles.targetKey}>🔥 Daily Calorie Target</Text>
            <Text style={styles.targetVal}>{profile?.calorieGoal || 2000} kcal</Text>
          </View>
          <View style={styles.targetRow}>
            <Text style={styles.targetKey}>🥩 Daily Protein Target</Text>
            <Text style={styles.targetVal}>{profile?.proteinGoalGrams || 140} g</Text>
          </View>
          <View style={[styles.targetRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.targetKey}>💧 Daily Water Target</Text>
            <Text style={styles.targetVal}>{profile?.waterGoalMl || 2500} ml</Text>
          </View>
        </GlassCard>

        {/* Onboarding Reset Zone */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
        </View>

        <GlassCard style={styles.resetCard}>
          <View style={styles.resetTextCol}>
            <Text style={styles.resetTitle}>Reset Onboarding Flow</Text>
            <Text style={styles.resetDesc}>
              Re-run the initial onboarding survey to re-calculate your goals and targets.
            </Text>
          </View>
          <Button
            variant="secondary"
            label="🔄 Reset Onboarding"
            onPress={() => setIsResetConfirming(true)}
            style={{ marginTop: 12, backgroundColor: '#FEE2E2' }}
            labelStyle={{ color: '#991B1B' }}
          />
        </GlassCard>
      </ScrollView>

      {/* Edit Profile Modal */}
      <FloatingModal visible={isEditing} onClose={() => setIsEditing(false)} title="✏️ Edit Local Profile">
        <ScrollView style={styles.editForm}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={editName} onChangeText={setEditName} />

          <View style={styles.row}>
            <View style={[styles.halfInput, { marginRight: 8 }]}>
              <Text style={styles.label}>Age</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={editAge} onChangeText={setEditAge} />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={editHeight} onChangeText={setEditHeight} />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.halfInput, { marginRight: 8 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={editWeight} onChangeText={setEditWeight} />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Target Weight (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={editTargetWeight}
                onChangeText={setEditTargetWeight}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              variant="secondary"
              label="Cancel"
              onPress={() => setIsEditing(false)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              variant="primary"
              label="Save Changes"
              onPress={handleSaveProfile}
              loading={saving}
              style={{ flex: 1 }}
            />
          </View>
        </ScrollView>
      </FloatingModal>

      {/* Reset Confirmation Modal */}
      <FloatingModal
        visible={isResetConfirming}
        onClose={() => setIsResetConfirming(false)}
        title="⚠️ Confirm Onboarding Reset"
      >
        <View style={styles.confirmContent}>
          <Text style={styles.confirmText}>
            Are you sure you want to reset onboarding? This will clear your stored profile biometrics and return to the onboarding flow.
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
              label="Yes, Reset"
              onPress={handleResetOnboarding}
              style={{ flex: 1, backgroundColor: '#DC2626' }}
              labelStyle={{ color: '#FFFFFF' }}
            />
          </View>
        </View>
      </FloatingModal>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  profileHeaderCard: {
    padding: 16,
    marginBottom: 20,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 14,
    flex: 1,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 4,
  },
  goalTag: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 2,
  },
  activityTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
  },
  actionRow: {
    flexDirection: 'row',
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.gray900,
  },
  bioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  bioTile: {
    width: '48%',
    padding: 14,
    alignItems: 'center',
  },
  bioIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  bioLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    marginBottom: 2,
  },
  bioVal: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  targetsCard: {
    padding: 16,
    marginBottom: 20,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  targetKey: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray700,
  },
  targetVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  resetCard: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  resetTextCol: {},
  resetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 4,
  },
  resetDesc: {
    fontSize: 12,
    color: '#B91C1C',
    lineHeight: 18,
  },
  editForm: {
    maxHeight: 400,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray700,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.gray900,
  },
  row: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
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
});
