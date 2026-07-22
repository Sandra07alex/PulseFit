import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '../../store/onboardingStore';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { OnboardingProgressIndicator } from '../../features/onboarding/components/OnboardingProgressIndicator';
import { Step1Welcome } from '../../features/onboarding/steps/Step1Welcome';
import { Step2Goal } from '../../features/onboarding/steps/Step2Goal';
import { Step3Biometrics } from '../../features/onboarding/steps/Step3Biometrics';
import { Step4Activity } from '../../features/onboarding/steps/Step4Activity';
import { Step5TargetWeight } from '../../features/onboarding/steps/Step5TargetWeight';
import { Step6Reminder } from '../../features/onboarding/steps/Step6Reminder';
import { Step7MeetCompanions } from '../../features/onboarding/steps/Step7MeetCompanions';
import { Step8Celebration } from '../../features/onboarding/steps/Step8Celebration';

export default function OnboardingScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animate step transitions
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(16);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 160,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, [store.step, fadeAnim, slideAnim]);

  const handleComplete = () => {
    store.completeOnboarding();
    router.replace('/(tabs)/home');
  };

  const renderCurrentStep = () => {
    switch (store.step) {
      case 1:
        return <Step1Welcome onNext={store.nextStep} />;

      case 2:
        return (
          <Step2Goal
            selectedGoal={store.goal}
            onSelectGoal={(goal) => store.updateData({ goal })}
            onNext={store.nextStep}
          />
        );

      case 3:
        return (
          <Step3Biometrics
            unitSystem={store.unitSystem}
            onUnitChange={(unitSystem) => store.updateData({ unitSystem })}
            heightCm={store.heightCm}
            heightInches={store.heightInches}
            weightKg={store.weightKg}
            weightLbs={store.weightLbs}
            age={store.age}
            gender={store.gender}
            onChange={(field, val) => store.updateData({ [field]: val })}
            onNext={store.nextStep}
          />
        );

      case 4:
        return (
          <Step4Activity
            selectedActivity={store.activityLevel}
            onSelectActivity={(activityLevel) => store.updateData({ activityLevel })}
            onNext={store.nextStep}
          />
        );

      case 5:
        return (
          <Step5TargetWeight
            unitSystem={store.unitSystem}
            targetWeightKg={store.targetWeightKg || store.weightKg}
            targetWeightLbs={store.targetWeightLbs || store.weightLbs}
            onChangeTarget={(val) =>
              store.updateData(
                store.unitSystem === 'metric' ? { targetWeightKg: val } : { targetWeightLbs: val }
              )
            }
            onNext={store.nextStep}
          />
        );

      case 6:
        return (
          <Step6Reminder
            selectedPreset={store.reminderPreset}
            timeString={store.reminderTime}
            onSelectReminder={(reminderPreset, reminderTime) =>
              store.updateData({ reminderPreset, reminderTime })
            }
            onNext={store.nextStep}
          />
        );

      case 7:
        return <Step7MeetCompanions onNext={store.nextStep} />;

      case 8:
      default:
        return <Step8Celebration onComplete={handleComplete} />;
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {store.step < 8 && (
          <OnboardingProgressIndicator
            currentStep={store.step}
            totalSteps={8}
            onBack={store.prevStep}
            showBack={store.step > 1}
          />
        )}

        <Animated.View
          style={[
            styles.stepContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderCurrentStep()}
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
