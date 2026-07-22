import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface TagProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  icon?: string;
  style?: ViewStyle;
}

export const Tag: React.FC<TagProps> = ({
  label,
  color = colors.primary,
  backgroundColor = colors.primarySoft,
  icon,
  style,
}) => {
  return (
    <View style={[styles.tag, { backgroundColor }, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 4,
  },
  icon: {
    fontSize: 12,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
});
