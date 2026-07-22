import React from 'react';
import { AppShell, EmptyPage } from '../../components/layout';

export default function NutritionScreen() {
  return (
    <AppShell
      headerProps={{
        title: 'Nutrition & Macros',
        subtitle: 'Nourish your body with clean energy',
        companionId: 'brocco',
        companionMood: 'idle',
        greeting: '🥦 Brocco Guide',
      }}
    >
      <EmptyPage
        companionId="brocco"
        companionMood="thinking"
        greeting="🥦 Brocco Guide"
        title="Nutrition Screen"
        subtitle="Macro tracking, food loggers, and personalized meal insights will appear here."
      />
    </AppShell>
  );
}
