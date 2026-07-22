import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../providers/AppProvider';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </AppProvider>
  );
}
