/**
 * @file app/(app)/food/_layout.tsx
 * @description Stack navigator for the food sub-routes.
 * All food screens slide in as modal-style stack pages.
 */

import React from 'react';
import { Stack } from 'expo-router';

export default function FoodLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown:  false,
        animation:    'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="add"     options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="details" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="edit"    options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
