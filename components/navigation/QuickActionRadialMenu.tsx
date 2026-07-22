import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Animated, Modal, Pressable } from 'react-native';
import { Companion } from '../mascot/Companion';
import { colors } from '../../theme/colors';
import { shadows } from '../../theme/shadows';

export interface QuickActionOption {
  id: 'food' | 'water' | 'workout' | 'weight';
  label: string;
  icon: string;
  color: string;
  companionId: 'brocco' | 'droppy' | 'blaze' | 'eggsy';
}

export const QUICK_ACTIONS: QuickActionOption[] = [
  { id: 'food', label: '+ Food', icon: '🥦', color: colors.companions.brocco.primary, companionId: 'brocco' },
  { id: 'water', label: '+ Water', icon: '💧', color: colors.companions.droppy.primary, companionId: 'droppy' },
  { id: 'workout', label: '+ Workout', icon: '🔥', color: colors.companions.blaze.primary, companionId: 'blaze' },
  { id: 'weight', label: '+ Weight', icon: '⚖️', color: colors.companions.eggsy.primary, companionId: 'eggsy' },
];

interface QuickActionRadialMenuProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction: (actionId: QuickActionOption['id']) => void;
}

export const QuickActionRadialMenu: React.FC<QuickActionRadialMenuProps> = ({
  visible,
  onClose,
  onSelectAction,
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(animValue, {
        toValue: 1,
        tension: 140,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animValue]);

  if (!visible) return null;

  const backdropOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const centerScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
        </Pressable>

        <View style={styles.centerContainer}>
          {/* Radial action buttons */}
          {QUICK_ACTIONS.map((action, index) => {
            // Position radially around center
            const angle = (index * 90 - 135) * (Math.PI / 180);
            const radius = 105;

            const translateX = animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(angle) * radius],
            });

            const translateY = animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.sin(angle) * radius],
            });

            const itemScale = animValue.interpolate({
              inputRange: [0, 0.4, 1],
              outputRange: [0, 0.5, 1],
            });

            return (
              <Animated.View
                key={action.id}
                style={[
                  styles.actionWrapper,
                  {
                    transform: [{ translateX }, { translateY }, { scale: itemScale }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.actionButton, { backgroundColor: action.color }, shadows.lg]}
                  onPress={() => {
                    onSelectAction(action.id);
                    onClose();
                  }}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}

          {/* Center morphing mascot button */}
          <Animated.View style={[styles.centerMascot, { transform: [{ scale: centerScale }] }]}>
            <TouchableOpacity activeOpacity={0.9} onPress={onClose} style={styles.closeButtonInner}>
              <Companion id="pulse" mood="celebrate" size={72} animated={false} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  centerContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  actionWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    minWidth: 100,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  centerMascot: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 999,
    padding: 6,
    ...shadows.mascotGlow,
  },
});
