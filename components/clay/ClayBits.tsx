import React, { useEffect, useRef } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClayCard } from './ClayCard';
import { clay, clayTints, ClayTint } from '../../theme/clay';
import { typography } from '../../theme/typography';

// ---------------------------------------------------------------------------
// ClayIcon – puffy rounded tile holding an emoji
// ---------------------------------------------------------------------------

export const ClayIcon: React.FC<{
  emoji: string;
  tint?: ClayTint;
  size?: number;
  style?: StyleProp<ViewStyle>;
}> = ({ emoji, tint = 'cloud', size = 44, style }) => (
  <ClayCard
    tint={tint}
    depth="sm"
    radius={size * 0.36}
    padding={0}
    glow="soft"
    style={style}
    contentStyle={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
  >
    <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
  </ClayCard>
);

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const ClayTitle: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}> = ({ children, size = 22, color = clay.ink.primary, style, numberOfLines }) => (
  <Text
    numberOfLines={numberOfLines}
    style={[{ fontFamily: typography.fonts.display, fontSize: size, color, letterSpacing: 0.1 }, style]}
  >
    {children}
  </Text>
);

export const ClayLabel: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}> = ({ children, color = clay.ink.secondary, style, numberOfLines }) => (
  <Text
    numberOfLines={numberOfLines}
    style={[{ fontFamily: typography.fonts.displayMedium, fontSize: 13, color }, style]}
  >
    {children}
  </Text>
);

export const ClaySectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}> = ({ title, subtitle, action, onAction }) => (
  <View style={bits.sectionHeader}>
    <View style={{ flex: 1 }}>
      <ClayTitle size={19}>{title}</ClayTitle>
      {subtitle ? <ClayLabel>{subtitle}</ClayLabel> : null}
    </View>
    {action && onAction ? (
      <Pressable onPress={onAction} hitSlop={10} accessibilityRole="button">
        <ClayLabel color={clayTints.pulse.accent} style={{ fontFamily: typography.fonts.displaySemibold }}>
          {action} ›
        </ClayLabel>
      </Pressable>
    ) : null}
  </View>
);

// ---------------------------------------------------------------------------
// ClayChip – selectable candy pill
// ---------------------------------------------------------------------------

export const ClayChip: React.FC<{
  label: string;
  emoji?: string;
  selected?: boolean;
  tint?: ClayTint;
  onPress?: () => void;
}> = ({ label, emoji, selected, tint = 'pulse', onPress }) => (
  <ClayCard
    tint={selected ? tint : 'cloud'}
    depth="sm"
    radius={999}
    padding={0}
    glow={selected ? 'soft' : 'none'}
    onPress={onPress}
    accessibilityLabel={label}
    contentStyle={bits.chip}
  >
    {emoji ? <Text style={{ fontSize: 15 }}>{emoji}</Text> : null}
    <Text
      style={[
        bits.chipLabel,
        { color: selected ? clayTints[tint].ink : clay.ink.secondary },
      ]}
    >
      {label}
    </Text>
  </ClayCard>
);

// ---------------------------------------------------------------------------
// ClayInput – soft inset field
// ---------------------------------------------------------------------------

export const ClayInput: React.FC<
  TextInputProps & { label?: string; suffix?: string; tint?: ClayTint; big?: boolean }
> = ({ label, suffix, tint = 'pulse', big, style, ...rest }) => (
  <View style={{ gap: 6 }}>
    {label ? <ClayLabel>{label}</ClayLabel> : null}
    <View style={[bits.inputWrap, { borderColor: clayTints[tint].soft }]}>
      <View style={bits.inputInset} pointerEvents="none" />
      <TextInput
        placeholderTextColor={clay.ink.tertiary}
        style={[
          bits.input,
          big && { fontSize: 34, textAlign: 'center', color: clayTints[tint].accent },
          style,
        ]}
        {...rest}
      />
      {suffix ? <Text style={bits.inputSuffix}>{suffix}</Text> : null}
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// ClaySheet – bottom sheet with a bouncy entrance
// ---------------------------------------------------------------------------

export const ClaySheet: React.FC<{
  visible: boolean;
  onClose: () => void;
  title: string;
  emoji?: string;
  children: React.ReactNode;
}> = ({ visible, onClose, title, emoji, children }) => {
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      y.setValue(400);
      Animated.spring(y, { toValue: 0, tension: 90, friction: 11, useNativeDriver: true }).start();
    }
  }, [visible, y]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={bits.backdrop} onPress={onClose} accessibilityLabel="Close" />
        <Animated.View
          style={[
            bits.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 12, transform: [{ translateY: y }] },
          ]}
        >
          <View style={bits.handle} />
          <View style={bits.sheetTitleRow}>
            {emoji ? <Text style={{ fontSize: 26 }}>{emoji}</Text> : null}
            <ClayTitle size={22}>{title}</ClayTitle>
          </View>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// useBounceIn – pop-in entrance for staggered content
// ---------------------------------------------------------------------------

export function useBounceIn(delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, { toValue: 1, delay, tension: 70, friction: 8, useNativeDriver: true }).start();
  }, [v, delay]);
  return {
    opacity: v,
    transform: [
      { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
      { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) },
    ],
  };
}

export const BounceIn: React.FC<{ delay?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({
  delay = 0,
  children,
  style,
}) => {
  const anim = useBounceIn(delay);
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
};

const bits = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  chipLabel: {
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 14,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: 18,
    borderWidth: 2,
    paddingHorizontal: 16,
    minHeight: 54,
    overflow: 'hidden',
  },
  inputInset: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: clay.inset,
  },
  input: {
    flex: 1,
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 18,
    color: clay.ink.primary,
    paddingVertical: 12,
  },
  inputSuffix: {
    fontFamily: typography.fonts.displaySemibold,
    fontSize: 16,
    color: clay.ink.secondary,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46, 35, 80, 0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 10,
    gap: 16,
    borderTopWidth: 6,
    borderColor: '#F6EDE2',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#E9DCCD',
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
