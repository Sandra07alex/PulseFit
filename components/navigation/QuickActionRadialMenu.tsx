import React, { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Companion } from '../mascot/Companion';
import { ClayCard } from '../clay/ClayCard';
import { clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';

export interface QuickActionOption {
  id: 'food' | 'water' | 'workout' | 'weight';
  label: string;
  icon: string;
  tint: ClayTint;
  companionId: 'brocco' | 'droppy' | 'blaze' | 'eggsy';
}

export const QUICK_ACTIONS: QuickActionOption[] = [
  { id: 'food', label: 'Food', icon: '🥦', tint: 'brocco', companionId: 'brocco' },
  { id: 'water', label: 'Water', icon: '💧', tint: 'droppy', companionId: 'droppy' },
  { id: 'workout', label: 'Workout', icon: '🔥', tint: 'blaze', companionId: 'blaze' },
  { id: 'weight', label: 'Weight', icon: '⚖️', tint: 'eggsy', companionId: 'eggsy' },
];

/** Upward fan, left → right (degrees; 0 = right, -90 = straight up) */
const ANGLES = [-162, -118, -62, -18];
const RADIUS = 122;

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
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      anim.setValue(0);
      Animated.spring(anim, { toValue: 1, tension: 110, friction: 8, useNativeDriver: true }).start();
    }
  }, [visible, anim]);

  if (!visible) return null;

  const backdropOpacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Modal transparent visible animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close quick log menu">
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </Pressable>

      <View
        pointerEvents="box-none"
        // matches the centre of FloatingIslandNav's mascot button
        style={[styles.anchor, { bottom: Math.max(insets.bottom, 12) + 6 + 62 }]}
      >
        <Animated.Text style={[styles.prompt, { opacity: anim, bottom: RADIUS + 70 }]}>
          What are we logging? ✨
        </Animated.Text>

        {QUICK_ACTIONS.map((action, i) => {
          const rad = (ANGLES[i] * Math.PI) / 180;
          const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(rad) * RADIUS] });
          const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(rad) * RADIUS] });
          const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.2, 0.7, 1] });

          return (
            <Animated.View
              key={action.id}
              style={[styles.item, { transform: [{ translateX }, { translateY }, { scale }] }]}
            >
              <ClayCard
                tint="cloud"
                depth="md"
                radius={36}
                padding={0}
                glow="strong"
                onPress={() => {
                  onSelectAction(action.id);
                  onClose();
                }}
                accessibilityLabel={`Log ${action.label}`}
                contentStyle={styles.bubble}
              >
                <Companion id={action.companionId} mood="wave" size={48} animated={false} />
              </ClayCard>
              <View style={styles.labelPill}>
                <Text style={[styles.label, { color: clayTints.pulse.accent }]}>
                  {action.icon} {action.label}
                </Text>
              </View>
            </Animated.View>
          );
        })}

        {/* close button sits exactly over the nav's center button */}
        <ClayCard
          tint="cloud"
          depth="md"
          radius={40}
          padding={0}
          glow="strong"
          onPress={onClose}
          accessibilityLabel="Close"
          contentStyle={styles.close}
        >
          <Text style={styles.closeX}>✕</Text>
        </ClayCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 35, 80, 0.42)',
  },
  anchor: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 0,
  },
  prompt: {
    position: 'absolute',
    fontFamily: typography.fonts.display,
    fontSize: 20,
    color: '#FFFFFF',
  },
  item: {
    position: 'absolute',
    alignItems: 'center',
  },
  bubble: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelPill: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  label: {
    fontFamily: typography.fonts.display,
    fontSize: 12,
  },
  close: {
    width: 74,
    height: 74,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    fontSize: 26,
    color: '#7B66FF',
    fontFamily: typography.fonts.display,
  },
});
