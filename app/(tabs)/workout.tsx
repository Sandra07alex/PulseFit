import React from 'react';
import { AppShell, EmptyPage } from '../../components/layout';

export default function WorkoutScreen() {
  return (
    <AppShell
      headerProps={{
        title: 'Workouts & Activity',
        subtitle: 'Ignite your inner fire & burn calories',
        companionId: 'blaze',
        companionMood: 'idle',
        greeting: '🔥 Blaze Coach',
      }}
    >
      <EmptyPage
        companionId="blaze"
        companionMood="celebrate"
        greeting="🔥 Blaze Coach"
        title="Workout Screen"
        subtitle="Active exercise sessions, calorie expenditure, and training routines will appear here."
      />
    </AppShell>
  );
}
