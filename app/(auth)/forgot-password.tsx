// Forgot password screen placeholder
import React from 'react';
import { View } from 'react-native';
import { Screen, Text } from '~/components/ui';

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text variant="h3">Forgot Password Screen</Text>
      </View>
    </Screen>
  );
}
