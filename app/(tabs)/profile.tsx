import React from 'react';
import { AppShell, EmptyPage } from '../../components/layout';

export default function ProfileScreen() {
  return (
    <AppShell
      headerProps={{
        title: 'Profile & Recovery',
        subtitle: 'Rest well to recover strong',
        companionId: 'luna',
        companionMood: 'idle',
        greeting: '🌙 Luna Guide',
      }}
    >
      <EmptyPage
        companionId="luna"
        companionMood="sleep"
        greeting="🌙 Luna Guide"
        title="Profile Screen"
        subtitle="Personal account preferences, sleep recovery trends, and app settings will appear here."
      />
    </AppShell>
  );
}
