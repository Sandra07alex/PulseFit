/**
 * @file FoodSearchBar.tsx
 * @description Animated search input with clear button and loading indicator.
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';

interface FoodSearchBarProps {
  value:        string;
  onChangeText: (text: string) => void;
  onClear:      () => void;
  isLoading?:   boolean;
  placeholder?: string;
  autoFocus?:   boolean;
}

export const FoodSearchBar: React.FC<FoodSearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  isLoading    = false,
  placeholder  = 'Search foods, brands, categories…',
  autoFocus    = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const inputRef  = useRef<TextInput>(null);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue:         1,
      tension:         160,
      friction:        12,
      useNativeDriver: true,
    }).start();

    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, []);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.lightMode.textTertiary}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search foods"
        accessibilityHint="Type to search for foods"
      />
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : value.length > 0 ? (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Clear search"
        >
          <View style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: colors.lightMode.surface,
    borderRadius:   radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.md,
    gap:            spacing.md,
    ...shadows.sm,
  },
  icon: {
    fontSize: 16,
  },
  input: {
    flex:       1,
    fontSize:   typography.sizes.base,
    fontWeight: '500',
    color:      colors.lightMode.text,
    padding:    0,
  },
  clearBtn: {
    backgroundColor: colors.gray200,
    borderRadius:    radius.full,
    width:           22,
    height:          22,
    alignItems:      'center',
    justifyContent:  'center',
  },
  clearText: {
    fontSize:  10,
    fontWeight: '700',
    color:     colors.gray600,
  },
});
