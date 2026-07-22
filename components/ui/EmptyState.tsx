import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Companion } from '../mascot/Companion';
import { CompanionId, CompanionMood } from '../mascot/types';
import { Button } from './Button';
import { colors } from '../../theme/colors';

export interface EmptyStateProps {
  title: string;
  description?: string;
  companionId?: CompanionId;
  companionMood?: CompanionMood;
  actionLabel?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  companionId = 'luna',
  companionMood = 'sleep',
  actionLabel,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mascotWrapper}>
        <Companion id={companionId} mood={companionMood} size="lg" animated={true} />
      </View>

      <Text style={styles.title}>{title}</Text>

      {description && <Text style={styles.description}>{description}</Text>}

      {actionLabel && onActionPress && (
        <Button
          label={actionLabel}
          variant="primary"
          size="md"
          onPress={onActionPress}
          style={{ marginTop: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  mascotWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
});
