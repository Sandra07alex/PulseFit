import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Companion } from '../mascot/Companion';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface QuoteCardProps {
  quote: string;
  author?: string;
  style?: ViewStyle;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  author = 'PulseFit Coach',
  style,
}) => {
  return (
    <Card variant="soft" style={style}>
      <View style={styles.container}>
        <Companion id="pulse" mood="wave" size="md" animated={true} />

        <View style={styles.bubble}>
          <Text style={styles.quoteText}>&ldquo;{quote}&rdquo;</Text>
          <Text style={styles.authorText}>— {author}</Text>
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
  bubble: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  quoteText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    color: colors.gray800,
    lineHeight: 20,
  },
  authorText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
});
