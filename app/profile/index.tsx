// Profile screen placeholder
import React from 'react';
import { View } from 'react-native';
import { Screen, Text } from '~/components/ui';

export default function ProfileScreen() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="h3">Profile Screen</Text>
      </View>
    </Screen>
  );
}
