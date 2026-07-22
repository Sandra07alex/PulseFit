import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface MetricTileProps {
  label: string;
  value: string | number;
  icon: string;
  accentColor?: string;
  style?: ViewStyle;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  icon,
  accentColor = colors.primary,
  style,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: accentColor + '10' }, style]}>
      <View style={[styles.iconBox, { backgroundColor: accentColor + '25' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.cardSmall,
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textContainer: {
    justifyContent: 'center',
  },
  value: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  label: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: '500',
  },
});
