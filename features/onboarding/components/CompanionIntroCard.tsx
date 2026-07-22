import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Companion } from '../../../components/mascot/Companion';
import { COMPANION_CONFIGS } from '../../../components/mascot/Companion';
import { CompanionId } from '../../../components/mascot/types';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';

const COMPANIONS_ROSTER: CompanionId[] = ['pulse', 'droppy', 'eggsy', 'brocco', 'blaze', 'luna'];

export const CompanionIntroCard: React.FC = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {COMPANIONS_ROSTER.map((id) => {
        const config = COMPANION_CONFIGS[id];
        return (
          <View key={id} style={[styles.card, { borderColor: config.primaryColor + '40' }]}>
            <Companion id={id} mood="idle" size="md" animated={true} />

            <View style={styles.infoGroup}>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{config.name}</Text>
                <View style={[styles.tag, { backgroundColor: config.softColor }]}>
                  <Text style={[styles.tagText, { color: config.primaryColor }]}>{config.domain}</Text>
                </View>
              </View>

              <Text style={styles.tagline}>"{config.tagline}"</Text>
              <Text style={styles.personality}>✨ {config.personality}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: radius.card,
    borderWidth: 1.5,
    gap: 14,
  },
  infoGroup: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    color: colors.gray700,
    marginBottom: 2,
  },
  personality: {
    fontSize: 11,
    color: colors.gray500,
  },
});
