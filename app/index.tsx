import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { LocalProfileService } from '../services/LocalProfileService';
import { ClayBackground } from '../components/clay/ClayBackground';

/** Entry: returning users go straight to Today, new users to onboarding */
export default function Index() {
  const [target, setTarget] = useState<'/(tabs)/home' | '/onboarding' | null>(null);

  useEffect(() => {
    LocalProfileService.hasCompletedOnboarding()
      .then((done) => setTarget(done ? '/(tabs)/home' : '/onboarding'))
      .catch(() => setTarget('/onboarding'));
  }, []);

  if (!target) return <ClayBackground />;
  return <Redirect href={target} />;
}
