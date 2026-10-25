import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
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
} from '../../components/clay';
import { Companion } from '../../components/mascot/Companion';
import { LocalProfileService } from '../../services';
import type { UserProfile } from '../../types/models';
import { useToast } from '../../hooks/useToast';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useHaptics } from '../../hooks/useHaptics';
import { clay, clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';

const GOALS: { value: string; label: string; emoji: string }[] = [
  { value: 'lose_fat', label: 'Lose Fat', emoji: '🔥' },
  { value: 'build_muscle', label: 'Build Muscle', emoji: '💪' },
  { value: 'improve_fitness', label: 'Fitness', emoji: '⚡' },
  { value: 'increase_endurance', label: 'Endurance', emoji: '🏃' },
  { value: 'stay_healthy', label: 'Stay Healthy', emoji: '✨' },
];

const ACTIVITIES: { value: UserProfile['activityLevel']; label: string; emoji: string }[] = [
  { value: 'sedentary', label: 'Sedentary', emoji: '🛋️' },
  { value: 'lightly_active', label: 'Light', emoji: '🚶' },
  { value: 'moderately_active', label: 'Moderate', emoji: '🚴' },
  { value: 'very_active', label: 'Very Active', emoji: '🏃' },
  { value: 'athlete', label: 'Athlete', emoji: '💥' },
];

const formatGoal = (g?: string) => {
  const goal = GOALS.find((x) => x.value === g) ?? GOALS[4];
  return `${goal.emoji} ${goal.label}`;
};

const formatActivity = (a?: string) => {
  const act = ACTIVITIES.find((x) => x.value === a) ?? ACTIVITIES[2];
  return `${act.emoji} ${act.label}`;
};

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
  const [editActivity, setEditActivity] = useState<UserProfile['activityLevel']>('moderately_active');
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
        activityLevel: editActivity,
      });
      if (updated) {
        setProfile(updated);
        haptics.success();
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
    haptics.warning();
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

  const bio: { emoji: string; label: string; value: string; tint: ClayTint }[] = [
    { emoji: '📏', label: 'Height', value: `${profile?.heightCm ?? 175} cm`, tint: 'droppy' },
    { emoji: '⚖️', label: 'Weight', value: `${profile?.weightKg ?? 70} kg`, tint: 'luna' },
    { emoji: '🎯', label: 'Target', value: `${profile?.targetWeightKg ?? 68} kg`, tint: 'brocco' },
    { emoji: '🎂', label: 'Age', value: `${profile?.age ?? 26} yrs`, tint: 'eggsy' },
  ];

  const targets: { emoji: string; label: string; value: string; tint: ClayTint }[] = [
    { emoji: '🔥', label: 'Calories', value: `${profile?.calorieGoal ?? 2000} kcal`, tint: 'blaze' },
    { emoji: '🥚', label: 'Protein', value: `${profile?.proteinGoalGrams ?? 140} g`, tint: 'eggsy' },
    { emoji: '💧', label: 'Water', value: `${profile?.waterGoalMl ?? 2500} ml`, tint: 'droppy' },
  ];

  return (
    <ClayScreen
      title="Profile"
      subtitle="Your body, your goals"
      companionId="luna"
      overlay={
        <>
          {/* Edit sheet */}
          <ClaySheet visible={isEditing} onClose={() => setIsEditing(false)} title="Edit profile" emoji="✏️">
            <ScrollView style={styles.editForm} contentContainerStyle={{ gap: 12 }} keyboardShouldPersistTaps="handled">
              <ClayInput label="Name" value={editName} onChangeText={setEditName} placeholder="Your name" />
              <View style={styles.row}>
                <View style={styles.half}>
                  <ClayInput label="Age" keyboardType="numeric" value={editAge} onChangeText={setEditAge} suffix="yrs" />
                </View>
                <View style={styles.half}>
                  <ClayInput label="Height" keyboardType="numeric" value={editHeight} onChangeText={setEditHeight} suffix="cm" />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.half}>
                  <ClayInput label="Weight" keyboardType="decimal-pad" value={editWeight} onChangeText={setEditWeight} suffix="kg" />
                </View>
                <View style={styles.half}>
                  <ClayInput
                    label="Target"
                    keyboardType="decimal-pad"
                    value={editTargetWeight}
                    onChangeText={setEditTargetWeight}
                    suffix="kg"
                  />
                </View>
              </View>
              <ClayLabel>Goal</ClayLabel>
              <View style={styles.wrap}>
                {GOALS.map((g) => (
                  <ClayChip key={g.value} label={g.label} emoji={g.emoji} selected={editGoal === g.value} onPress={() => setEditGoal(g.value)} />
                ))}
              </View>
              <ClayLabel>Activity</ClayLabel>
              <View style={styles.wrap}>
                {ACTIVITIES.map((a) => (
                  <ClayChip
                    key={a.value}
                    label={a.label}
                    emoji={a.emoji}
                    tint="brocco"
                    selected={editActivity === a.value}
                    onPress={() => setEditActivity(a.value)}
                  />
                ))}
              </View>
            </ScrollView>
            <View style={styles.row}>
              <ClayButton label="Cancel" tint="cloud" style={{ flex: 1 }} onPress={() => setIsEditing(false)} />
              <ClayButton label="Save" icon="✅" tint="pulse" style={{ flex: 1 }} loading={saving} onPress={handleSaveProfile} />
            </View>
          </ClaySheet>

          {/* Reset confirmation */}
          <ClaySheet visible={isResetConfirming} onClose={() => setIsResetConfirming(false)} title="Start over?" emoji="⚠️">
            <View style={styles.confirm}>
              <Companion id="luna" mood="sad" size={88} />
              <ClayLabel style={{ textAlign: 'center', fontSize: 14 }}>
                This clears your profile and takes you back through onboarding. Your logs stay safe.
              </ClayLabel>
            </View>
            <View style={styles.row}>
              <ClayButton label="Keep it" tint="cloud" style={{ flex: 1 }} onPress={() => setIsResetConfirming(false)} />
              <ClayButton label="Yes, reset" tint="blaze" style={{ flex: 1 }} onPress={handleResetOnboarding} />
            </View>
          </ClaySheet>
        </>
      }
    >
      {/* Identity */}
      <BounceIn>
        <ClayCard tint="pulse" depth="lg" radius={32} padding={20} glow="strong">
          <View style={styles.identity}>
            <ClayCard tint="cloud" depth="md" radius={40} padding={0} contentStyle={styles.avatar}>
              <Companion id="pulse" mood="celebrate" size={72} />
            </ClayCard>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.name} numberOfLines={1}>{profile?.name || 'Pulse Athlete'}</Text>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{formatGoal(profile?.goal)}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{formatActivity(profile?.activityLevel)}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.row, { marginTop: 16 }]}>
            <ClayButton
              label="Edit"
              icon="✏️"
              tint="cloud"
              size="sm"
              style={{ flex: 1 }}
              labelStyle={{ color: clayTints.pulse.accent }}
              onPress={() => setIsEditing(true)}
            />
            <ClayButton
              label="Settings"
              icon="⚙️"
              tint="cloud"
              size="sm"
              style={{ flex: 1 }}
              labelStyle={{ color: clayTints.pulse.accent }}
              onPress={() => router.push('/settings')}
            />
          </View>
        </ClayCard>
      </BounceIn>

      {/* Biometrics */}
      <BounceIn delay={80}>
        <ClaySectionHeader title="Biometrics" />
        <View style={styles.bioGrid}>
          {bio.map((b) => (
            <ClayCard key={b.label} tint="cloud" depth="md" radius={24} padding={14} style={styles.bioTile} contentStyle={styles.bioFace}>
              <ClayIcon emoji={b.emoji} tint={b.tint} size={40} />
              <ClayLabel>{b.label}</ClayLabel>
              <ClayTitle size={19} color={clayTints[b.tint].accent}>{b.value}</ClayTitle>
            </ClayCard>
          ))}
        </View>
      </BounceIn>

      {/* Daily targets */}
      <BounceIn delay={140}>
        <ClaySectionHeader title="Daily targets" subtitle="Calculated during onboarding" />
        <ClayCard tint="cloud" depth="md" radius={28} padding={8}>
          {targets.map((t, i) => (
            <View key={t.label} style={[styles.targetRow, i < targets.length - 1 && styles.targetDivider]}>
              <ClayIcon emoji={t.emoji} tint={t.tint} size={36} />
              <ClayLabel style={{ flex: 1, fontSize: 14, color: clay.ink.primary }}>{t.label}</ClayLabel>
              <ClayTitle size={17} color={clayTints[t.tint].accent}>{t.value}</ClayTitle>
            </View>
          ))}
        </ClayCard>
      </BounceIn>

      {/* Danger zone */}
      <BounceIn delay={200}>
        <ClaySectionHeader title="Start fresh" />
        <ClayCard tint="cloud" depth="md" radius={28} padding={18} contentStyle={{ gap: 12 }}>
          <ClayLabel style={{ fontSize: 14 }}>
            Re-run onboarding to recalculate your calorie, protein and water targets.
          </ClayLabel>
          <ClayButton label="Reset onboarding" icon="🔄" tint="blaze" fullWidth onPress={() => setIsResetConfirming(true)} />
        </ClayCard>
      </BounceIn>
    </ClayScreen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: typography.fonts.display,
    fontSize: 24,
    color: '#FFFFFF',
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bioTile: {
    width: '47%',
    flexGrow: 1,
  },
  bioFace: {
    alignItems: 'center',
    gap: 4,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  targetDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#F1ECFF',
  },
  editForm: {
    maxHeight: 420,
  },
  confirm: {
    alignItems: 'center',
    gap: 10,
  },
});
