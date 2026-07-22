import React from 'react';
import { View, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { Text } from './Text';
import { spacing, radius, colors } from '../../theme';

interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  initials,
  size = 'medium',
  backgroundColor = colors.primary,
}) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const sizeValue = sizeMap[size];

  const styles = StyleSheet.create({
    container: {
      width: sizeValue,
      height: sizeValue,
      borderRadius: radius.avatar,
      backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

  if (source) {
    return (
      <View style={styles.container}>
        <Image source={source} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="label" color={colors.white}>
        {initials || 'U'}
      </Text>
    </View>
  );
};
