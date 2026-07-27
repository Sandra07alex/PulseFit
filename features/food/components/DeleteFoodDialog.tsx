/**
 * @file DeleteFoodDialog.tsx
 * @description Confirmation modal/bottom-sheet for deleting a food log entry.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import type { FoodLogEntry } from '../types/food.types';

interface DeleteFoodDialogProps {
  visible:   boolean;
  entry:     FoodLogEntry | null;
  onConfirm: () => void;
  onCancel:  () => void;
}

export const DeleteFoodDialog: React.FC<DeleteFoodDialogProps> = ({
  visible,
  entry,
  onConfirm,
  onCancel,
}) => {
  const translateY = useRef(new Animated.Value(200)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1, duration: 200, useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0, tension: 120, friction: 14, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0, duration: 150, useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 200, duration: 200, useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!entry) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={[styles.overlay, { opacity }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[styles.sheet, { transform: [{ translateY }] }]}
            >
              {/* Handle */}
              <View style={styles.handle} />

              {/* Icon */}
              <Text style={styles.trashIcon}>🗑️</Text>

              {/* Title */}
              <Text style={styles.title}>Delete Food Log?</Text>
              <Text style={styles.body} numberOfLines={2}>
                Remove{' '}
                <Text style={styles.bold}>{entry.foodName}</Text>
                {' '}({entry.calculatedCalories} kcal) from{' '}
                <Text style={styles.bold}>{entry.mealType}</Text>?
              </Text>
              <Text style={styles.sub}>This action cannot be undone.</Text>

              {/* Buttons */}
              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={[styles.btn, styles.cancelBtn]}
                  onPress={onCancel}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel"
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, styles.deleteBtn]}
                  onPress={onConfirm}
                  accessibilityRole="button"
                  accessibilityLabel="Delete food log"
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor: colors.lightMode.surface,
    borderTopLeftRadius:  radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding:          spacing['3xl'],
    paddingBottom:    spacing['5xl'],
    gap:              spacing.lg,
    alignItems:       'center',
    ...shadows['2xl'],
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    radius.pill,
    backgroundColor: colors.gray300,
    marginBottom:    spacing.sm,
  },
  trashIcon: {
    fontSize: 44,
  },
  title: {
    fontSize:    typography.sizes['3xl'],
    fontWeight:  '800',
    color:       colors.lightMode.text,
    letterSpacing: -0.5,
  },
  body: {
    fontSize:  typography.sizes.lg,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  bold: {
    fontWeight: '700',
    color:      colors.lightMode.text,
  },
  sub: {
    fontSize:  typography.sizes.sm,
    color:     colors.lightMode.textTertiary,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap:           spacing.md,
    width:         '100%',
    marginTop:     spacing.sm,
  },
  btn: {
    flex:           1,
    height:         spacing.buttonHeight,
    borderRadius:   radius.button,
    alignItems:     'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    backgroundColor: colors.gray100,
  },
  deleteBtn: {
    backgroundColor: colors.error,
    ...shadows.button,
  },
  cancelText: {
    fontSize:   typography.sizes.base,
    fontWeight: '700',
    color:      colors.lightMode.textSecondary,
  },
  deleteText: {
    fontSize:   typography.sizes.base,
    fontWeight: '700',
    color:      colors.white,
  },
});
