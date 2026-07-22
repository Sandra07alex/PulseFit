import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { CompanionId, CompanionMood } from '../mascot/types';
import { Button } from './Button';
import { colors } from '../../theme/colors';

export interface CompanionCardProps {
  companionId: CompanionId;
  mood?: CompanionMood;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({
  companionId,
  mood = 'idle',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  return (
    <Card variant="default" style={style}>
      <View style={styles.container}>
        <View style={styles.mascotColumn}>
          <Companion id={companionId} mood={mood} size="md" animated={true} />
        </View>

        <View style={styles.textColumn}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {actionLabel && onAction && (
            <Button
              label={actionLabel}
              variant="quickAction"
              size="sm"
              onPress={onAction}
              style={{ marginTop: 10, alignSelf: 'flex-start' }}
            />
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  mascotColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: colors.gray600,
    lineHeight: 18,
  },
});
