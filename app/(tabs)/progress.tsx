import React from 'react';
import { AppShell, EmptyPage } from '../../components/layout';

export default function ProgressScreen() {
  return (
    <AppShell
      headerProps={{
        title: 'Progress & Metrics',
        subtitle: 'Track your body transformation',
        companionId: 'eggsy',
        companionMood: 'idle',
        greeting: '🥚 Eggsy Guide',
      }}
    >
      <EmptyPage
        companionId="eggsy"
        companionMood="wave"
        greeting="🥚 Eggsy Guide"
        title="Progress Screen"
        subtitle="Weight trends, body measurements, and milestone achievements will appear here."
      />
    </AppShell>
  );
}
