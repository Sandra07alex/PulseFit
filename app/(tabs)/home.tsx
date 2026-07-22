import React from 'react';
import { AppShell, EmptyPage } from '../../components/layout';

export default function HomeScreen() {
  return (
    <AppShell
      headerProps={{
        title: "Today's Energy",
        subtitle: 'Ready for another healthy day?',
        companionId: 'pulse',
        companionMood: 'wave',
        greeting: 'Good Morning ☀️',
      }}
    >
      <EmptyPage
        companionId="pulse"
        companionMood="celebrate"
        greeting="❤️ Pulse Coach"
        title="Home Screen"
        subtitle="Your daily energy dashboard, metrics summary, and personal coach insights will appear here."
      />
    </AppShell>
  );
}
