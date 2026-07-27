/**
 * @file FoodLogCard.tsx
 * @description Premium card for a single food log entry in a meal section.
 *
 * Features:
 *  - Food name, serving details, calories, protein
 *  - Time logged
 *  - Edit and Delete action buttons
 *  - Card lift animation on touch
 *  - Swipe-to-delete via long press (shows action row)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { colors }     from '../../../theme/colors';
import { radius }     from '../../../theme/radius';
import { spacing }    from '../../../theme/spacing';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import { useCardLiftAnimation } from '../../../hooks/useMotion';
import type { FoodLogEntry } from '../types/food.types';

interface FoodLogCardProps {
  entry:      FoodLogEntry;
  onEdit:     (entry: FoodLogEntry) => void;
  onDelete:   (entry: FoodLogEntry) => void;
}

function timeLabel(isoString: string): string {
  const date    = new Date(isoString);
  const hours   = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const amPm    = hours >= 12 ? 'PM' : 'AM';
  const h       = hours % 12 || 12;
  return `${h}:${minutes} ${amPm}`;
}

export const FoodLogCard: React.FC<FoodLogCardProps> = ({
  entry,
  onEdit,
  onDelete,
}) => {
  const { scale, translateY, handleTouchStart, handleTouchEnd } = useCardLiftAnimation();
  const [showActions, setShowActions] = useState(false);
  const actionsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(actionsOpacity, {
      toValue:         showActions ? 1 : 0,
      duration:        180,
      useNativeDriver: true,
    }).start();
  }, [showActions]);

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }, { translateY }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handleTouchStart}
        onPressOut={handleTouchEnd}
        onLongPress={() => setShowActions((prev) => !prev)}
        onPress={() => {
          if (showActions) setShowActions(false);
        }}
        style={styles.touchable}
        accessibilityRole="button"
        accessibilityLabel={`${entry.foodName}, ${entry.calculatedCalories} calories`}
      >
        {/* Left: food info */}
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{entry.foodName}</Text>
          <Text style={styles.serving}>
            {entry.quantity}{entry.servingUnit} · {timeLabel(entry.loggedAt)}
          </Text>
        </View>

        {/* Right: macros */}
        <View style={styles.macros}>
          <Text style={styles.calories}>{entry.calculatedCalories}</Text>
          <Text style={styles.caloriesUnit}>kcal</Text>
          <View style={styles.proteinBadge}>
            <Text style={styles.proteinText}>{Math.round(entry.calculatedProtein * 10) / 10}g protein</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action row (shown on long press) */}
      {showActions && (
        <Animated.View style={[styles.actionRow, { opacity: actionsOpacity }]}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => { setShowActions(false); onEdit(entry); }}
            accessibilityLabel={`Edit ${entry.foodName}`}
          >
            <Text style={styles.editText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => { setShowActions(false); onDelete(entry); }}
            accessibilityLabel={`Delete ${entry.foodName}`}
          >
            <Text style={styles.deleteText}>🗑️ Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.cardSmall,
    ...shadows.sm,
    overflow: 'hidden',
  },
  touchable: {
    flexDirection:    'row',
    alignItems:       'center',
    paddingVertical:  spacing.md,
    paddingHorizontal: spacing.lg,
    gap:              spacing.md,
  },
  info: {
    flex: 1,
    gap:  3,
  },
  name: {
    fontSize:    typography.sizes.base,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.2,
  },
  serving: {
    fontSize:  typography.sizes.sm,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
  },
  macros: {
    alignItems: 'flex-end',
    gap:        2,
  },
  calories: {
    fontSize:  typography.sizes.xl,
    fontWeight: '800',
    color:     colors.primary,
    letterSpacing: -0.5,
  },
  caloriesUnit: {
    fontSize:  typography.sizes.xs,
    fontWeight: '600',
    color:     colors.lightMode.textTertiary,
  },
  proteinBadge: {
    backgroundColor: colors.companions.eggsy.soft,
    borderRadius:    radius.pill,
    paddingHorizontal: 8,
    paddingVertical:   2,
  },
  proteinText: {
    fontSize:  typography.sizes.xs,
    fontWeight: '700',
    color:     colors.companions.eggsy.primary,
  },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  actionBtn: {
    flex:           1,
    paddingVertical: spacing.md,
    alignItems:     'center',
  },
  editBtn: {
    borderRightWidth:  1,
    borderRightColor:  colors.gray100,
  },
  deleteBtn: {},
  editText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.primary,
  },
  deleteText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.error,
  },
});
