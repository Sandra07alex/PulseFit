/**
 * @file WaterScreen.tsx
 * @description Offline water tracking screen.
 *
 * Features:
 *  - Animated progress bar (Droppy blue, spring-driven)
 *  - Large intake / goal display
 *  - Quick-add buttons: +250, +500, +750, +1000 ml
 *  - Custom amount input (modal bottom sheet)
 *  - Today's log history with swipe/tap delete
 *  - Friendly empty state when no logs
 *
 * Design follows PulseFit design system exactly:
 *  - colors, spacing, radius, shadows, typography
 *  - Droppy companion (#00B4D8) as the accent throughout
 *  - usePressAnimation for all buttons
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  RefreshControl,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useWater }         from '../hooks/useWater';
import { usePressAnimation } from '../../../hooks/useMotion';
import { confirmAction }     from '../../../utils/confirm';

import { colors }     from '../../../theme/colors';
import { spacing }    from '../../../theme/spacing';
import { radius }     from '../../../theme/radius';
import { shadows }    from '../../../theme/shadows';
import { typography } from '../../../theme/typography';
import type { WaterLog } from '../../../types/models';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DROPPY  = colors.companions.droppy.primary;  // #00B4D8
const DROPPY_SOFT = colors.companions.droppy.soft; // #E0F7FA

const QUICK_AMOUNTS = [250, 500, 750, 1000] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Animated horizontal progress bar */
const WaterProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue:         Math.min(percentage, 100),
      tension:         80,
      friction:        12,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const width = widthAnim.interpolate({
    inputRange:  [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={barStyles.track}>
      <Animated.View style={[barStyles.fill, { width }]} />
      {/* Wave shimmer overlay */}
      <View style={barStyles.shimmer} pointerEvents="none" />
    </View>
  );
};

const barStyles = StyleSheet.create({
  track: {
    height:          20,
    backgroundColor: DROPPY_SOFT,
    borderRadius:    radius.pill,
    overflow:        'hidden',
    position:        'relative',
  },
  fill: {
    position:        'absolute',
    top: 0, left: 0, bottom: 0,
    backgroundColor: DROPPY,
    borderRadius:    radius.pill,
  },
  shimmer: {
    position:        'absolute',
    top:             3,
    left:            0,
    right:           0,
    height:          6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius:    radius.pill,
  },
});

// ---------------------------------------------------------------------------
// Quick-add button
// ---------------------------------------------------------------------------

const QuickAddButton: React.FC<{
  amount:  number;
  onPress: (amount: number) => void;
}> = ({ amount, onPress }) => {
  const { scale, handlePressIn, handlePressOut } = usePressAnimation(0.92);
  const label = amount >= 1000 ? `${amount / 1000}L` : `${amount}`;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={qaStyles.btn}
        onPress={() => onPress(amount)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={`Add ${amount} millilitres`}
      >
        <Text style={qaStyles.plus}>+</Text>
        <Text style={qaStyles.label}>{label}</Text>
        <Text style={qaStyles.unit}>ml</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const qaStyles = StyleSheet.create({
  btn: {
    backgroundColor: DROPPY_SOFT,
    borderRadius:    radius.card,
    paddingVertical:  spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems:      'center',
    borderWidth:     1.5,
    borderColor:     colors.companions.droppy.light,
    minWidth:        72,
    gap:             2,
  },
  plus: {
    fontSize:   typography.sizes.base,
    fontWeight: '700',
    color:      DROPPY,
  },
  label: {
    fontSize:   typography.sizes['2xl'],
    fontWeight: '900',
    color:      DROPPY,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize:   typography.sizes.xs,
    fontWeight: '600',
    color:      colors.lightMode.textSecondary,
  },
});

// ---------------------------------------------------------------------------
// Log history item
// ---------------------------------------------------------------------------

const LogItem: React.FC<{
  log:      WaterLog;
  onDelete: (id: string) => void;
}> = ({ log, onDelete }) => {
  const time = new Date(log.loggedAt).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });
  const label = log.amountMl >= 1000
    ? `${(log.amountMl / 1000).toFixed(1)} L`
    : `${log.amountMl} ml`;

  return (
    <View style={logStyles.row}>
      <View style={logStyles.iconWrap}>
        <Text style={logStyles.icon}>💧</Text>
      </View>
      <View style={logStyles.info}>
        <Text style={logStyles.amount}>{label}</Text>
        <Text style={logStyles.time}>{time}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onDelete(log.id)}
        style={logStyles.deleteBtn}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${label} log`}
        hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
      >
        <Text style={logStyles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const logStyles = StyleSheet.create({
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.cardSmall,
    padding:         spacing.lg,
    gap:             spacing.md,
    ...shadows.sm,
  },
  iconWrap: {
    width:           40,
    height:          40,
    borderRadius:    radius.md,
    backgroundColor: DROPPY_SOFT,
    alignItems:      'center',
    justifyContent:  'center',
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  amount: {
    fontSize:   typography.sizes.lg,
    fontWeight: '700',
    color:      colors.lightMode.text,
  },
  time: {
    fontSize:  typography.sizes.sm,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
    marginTop: 2,
  },
  deleteBtn: { padding: 4 },
  deleteIcon: { fontSize: 18 },
});

// ---------------------------------------------------------------------------
// Custom amount modal
// ---------------------------------------------------------------------------

const CustomAmountModal: React.FC<{
  visible:   boolean;
  onClose:   () => void;
  onConfirm: (amount: number) => void;
}> = ({ visible, onClose, onConfirm }) => {
  const [input, setInput] = useState('');
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setInput('');
      Animated.parallel([
        Animated.timing(opacAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 120, friction: 14, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    const value = parseInt(input, 10);
    if (!value || value < 1 || value > 5000) {
      Alert.alert('Invalid amount', 'Please enter a value between 1 and 5000 ml.');
      return;
    }
    onConfirm(value);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[modalStyles.overlay, { opacity: opacAnim }]}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : undefined}>
              <Animated.View style={[modalStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                <View style={modalStyles.handle} />
                <Text style={modalStyles.title}>Custom Amount</Text>
                <Text style={modalStyles.subtitle}>How much water did you drink?</Text>

                <View style={modalStyles.inputRow}>
                  <TextInput
                    style={modalStyles.input}
                    value={input}
                    onChangeText={setInput}
                    keyboardType="number-pad"
                    placeholder="e.g. 350"
                    placeholderTextColor={colors.lightMode.textTertiary}
                    autoFocus
                    maxLength={4}
                    accessibilityLabel="Custom water amount"
                  />
                  <Text style={modalStyles.inputUnit}>ml</Text>
                </View>

                {/* Preset shortcuts inside modal */}
                <View style={modalStyles.presets}>
                  {[100, 200, 350, 600].map((v) => (
                    <TouchableOpacity
                      key={v}
                      style={modalStyles.preset}
                      onPress={() => setInput(String(v))}
                      accessibilityLabel={`Set ${v} ml`}
                    >
                      <Text style={modalStyles.presetText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={modalStyles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
                  <Text style={modalStyles.confirmText}>Add Water 💧</Text>
                </TouchableOpacity>
              </Animated.View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent:  'flex-end',
  },
  sheet: {
    backgroundColor:   colors.lightMode.surface,
    borderTopLeftRadius:  radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding:           spacing['3xl'],
    paddingBottom:     spacing['5xl'],
    gap:               spacing.lg,
    ...shadows['2xl'],
  },
  handle: {
    width:           40,
    height:          4,
    borderRadius:    radius.pill,
    backgroundColor: colors.gray300,
    alignSelf:       'center',
    marginBottom:    spacing.sm,
  },
  title: {
    fontSize:    typography.sizes['3xl'],
    fontWeight:  '800',
    color:       colors.lightMode.text,
    textAlign:   'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize:  typography.sizes.base,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: colors.lightMode.surfaceSubtle,
    borderRadius:   radius.input,
    borderWidth:    2,
    borderColor:    DROPPY,
    paddingHorizontal: spacing.xl,
    paddingVertical:   spacing.md,
    gap:            spacing.md,
  },
  input: {
    flex:       1,
    fontSize:   typography.sizes['5xl'],
    fontWeight: '900',
    color:      DROPPY,
    letterSpacing: -1,
    textAlign:  'center',
    padding:    0,
  },
  inputUnit: {
    fontSize:  typography.sizes.xl,
    fontWeight: '700',
    color:     colors.lightMode.textSecondary,
  },
  presets: {
    flexDirection: 'row',
    gap:           spacing.sm,
    justifyContent: 'center',
  },
  preset: {
    backgroundColor:   DROPPY_SOFT,
    borderRadius:      radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical:   spacing.sm,
    borderWidth:       1,
    borderColor:       colors.companions.droppy.light,
  },
  presetText: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     DROPPY,
  },
  confirmBtn: {
    backgroundColor: DROPPY,
    borderRadius:    radius.pill,
    height:          spacing.buttonHeight + 8,
    alignItems:      'center',
    justifyContent:  'center',
    ...shadows.button,
    marginTop:       spacing.sm,
  },
  confirmText: {
    fontSize:   typography.sizes.lg,
    fontWeight: '800',
    color:      colors.white,
    letterSpacing: -0.3,
  },
});

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export function WaterScreen() {
  const insets = useSafeAreaInsets();
  const {
    logs,
    totalMl,
    goalMl,
    remainingMl,
    percentage,
    isLoading,
    addWater,
    removeLog,
    refresh,
  } = useWater();

  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [isRefreshing,    setIsRefreshing]    = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }, [refresh]);

  const handleAdd = useCallback(async (amount: number) => {
    await addWater(amount);
  }, [addWater]);

  const handleDelete = useCallback(async (id: string) => {
    // confirmAction falls back to window.confirm on web, where Alert buttons do nothing
    if (await confirmAction('Delete Log', 'Remove this water entry?')) {
      await removeLog(id);
    }
  }, [removeLog]);

  // Format display values
  const totalDisplay = totalMl >= 1000
    ? `${(totalMl / 1000).toFixed(1)}L`
    : `${totalMl}ml`;
  const goalDisplay = goalMl >= 1000
    ? `${(goalMl / 1000).toFixed(1)}L`
    : `${goalMl}ml`;
  const remainDisplay = remainingMl >= 1000
    ? `${(remainingMl / 1000).toFixed(1)}L`
    : `${remainingMl}ml`;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.lightMode.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom + 120, 140) },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={DROPPY}
            colors={[DROPPY]}
          />
        }
      >
        {/* ── Page Header ───────────────────────────────── */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>💧 Hydration</Text>
          <Text style={styles.pageSubtitle}>Stay hydrated, stay sharp</Text>
        </View>

        {/* ── Hero Card ─────────────────────────────────── */}
        <View style={styles.heroCard}>
          {/* Droppy mascot row */}
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.heroLabel}>Today's Intake</Text>
              <View style={styles.heroAmountRow}>
                <Text style={styles.heroAmount}>{totalDisplay}</Text>
                <Text style={styles.heroGoal}> / {goalDisplay}</Text>
              </View>
            </View>
            <View style={styles.droppyBadge}>
              <Text style={styles.droppyEmoji}>🐬</Text>
              <Text style={styles.droppyPct}>{percentage}%</Text>
            </View>
          </View>

          {/* Progress bar */}
          <WaterProgressBar percentage={percentage} />

          {/* Remaining row */}
          <View style={styles.heroBottomRow}>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>Consumed</Text>
              <Text style={styles.statPillValue}>{totalDisplay}</Text>
            </View>
            <View style={[styles.statPill, styles.statPillAccent]}>
              <Text style={styles.statPillLabel}>Remaining</Text>
              <Text style={[styles.statPillValue, { color: DROPPY }]}>
                {remainingMl === 0 ? '🎉 Done!' : remainDisplay}
              </Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillLabel}>Goal</Text>
              <Text style={styles.statPillValue}>{goalDisplay}</Text>
            </View>
          </View>
        </View>

        {/* ── Quick Add ─────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          <View style={styles.quickGrid}>
            {QUICK_AMOUNTS.map((amount) => (
              <QuickAddButton key={amount} amount={amount} onPress={handleAdd} />
            ))}
          </View>
          <TouchableOpacity
            style={styles.customBtn}
            onPress={() => setCustomModalOpen(true)}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel="Add custom water amount"
          >
            <Text style={styles.customBtnIcon}>✏️</Text>
            <Text style={styles.customBtnText}>Custom Amount</Text>
          </TouchableOpacity>
        </View>

        {/* ── Today's Log ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Today's Log
            {logs.length > 0 && (
              <Text style={styles.logCount}> · {logs.length} entr{logs.length === 1 ? 'y' : 'ies'}</Text>
            )}
          </Text>

          {logs.length === 0 ? (
            /* Empty state */
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏜️</Text>
              <Text style={styles.emptyTitle}>No water logged yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap a quick-add button above to log your first sip today!
              </Text>
            </View>
          ) : (
            <View style={styles.logList}>
              {logs.map((log) => (
                <LogItem key={log.id} log={log} onDelete={handleDelete} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Custom Amount Modal ───────────────────────── */}
      <CustomAmountModal
        visible={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onConfirm={handleAdd}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex:            1,
    backgroundColor: colors.lightMode.background,
  },
  scroll: { flex: 1 },
  content: {
    padding: spacing.screenPadding,
    gap:     spacing['3xl'],
  },

  // Page header
  pageHeader: { gap: 4 },
  pageTitle: {
    fontSize:    typography.sizes['4xl'],
    fontWeight:  '900',
    color:       colors.lightMode.text,
    letterSpacing: -1,
  },
  pageSubtitle: {
    fontSize:  typography.sizes.base,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
  },

  // Hero card
  heroCard: {
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.heroCard,
    padding:         spacing['3xl'],
    gap:             spacing.xl,
    ...shadows.card,
    borderTopWidth:  4,
    borderTopColor:  DROPPY,
  },
  heroTopRow: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'flex-start',
  },
  heroLabel: {
    fontSize:  typography.sizes.sm,
    fontWeight: '700',
    color:     colors.lightMode.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems:    'baseline',
    marginTop:     spacing.xs,
  },
  heroAmount: {
    fontSize:    typography.sizes['5xl'],
    fontWeight:  '900',
    color:       DROPPY,
    letterSpacing: -1.5,
  },
  heroGoal: {
    fontSize:  typography.sizes.xl,
    fontWeight: '600',
    color:     colors.lightMode.textSecondary,
  },
  droppyBadge: {
    alignItems:      'center',
    backgroundColor: DROPPY_SOFT,
    borderRadius:    radius.card,
    padding:         spacing.md,
    minWidth:        64,
  },
  droppyEmoji: { fontSize: 28 },
  droppyPct: {
    fontSize:   typography.sizes.base,
    fontWeight: '800',
    color:      DROPPY,
    marginTop:  4,
  },
  heroBottomRow: {
    flexDirection: 'row',
    gap:           spacing.sm,
  },
  statPill: {
    flex:            1,
    backgroundColor: colors.lightMode.surfaceSubtle,
    borderRadius:    radius.cardSmall,
    padding:         spacing.md,
    alignItems:      'center',
    gap:             2,
  },
  statPillAccent: {
    backgroundColor: DROPPY_SOFT,
    borderWidth:     1,
    borderColor:     colors.companions.droppy.light,
  },
  statPillLabel: {
    fontSize:  typography.sizes.xs,
    fontWeight: '600',
    color:     colors.lightMode.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statPillValue: {
    fontSize:   typography.sizes.base,
    fontWeight: '800',
    color:      colors.lightMode.text,
    letterSpacing: -0.2,
  },

  // Section
  section: { gap: spacing.lg },
  sectionTitle: {
    fontSize:    typography.sizes.xl,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.3,
  },
  logCount: {
    fontSize:  typography.sizes.base,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
  },

  // Quick add grid
  quickGrid: {
    flexDirection: 'row',
    gap:           spacing.sm,
    justifyContent: 'space-between',
  },
  customBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             spacing.sm,
    backgroundColor: colors.lightMode.surface,
    borderRadius:    radius.button,
    paddingVertical: spacing.md,
    borderWidth:     1.5,
    borderColor:     colors.lightMode.border,
    ...shadows.sm,
  },
  customBtnIcon: { fontSize: 18 },
  customBtnText: {
    fontSize:   typography.sizes.base,
    fontWeight: '700',
    color:      colors.lightMode.textSecondary,
  },

  // Log list
  logList: { gap: spacing.sm },

  // Empty state
  emptyState: {
    alignItems:      'center',
    paddingVertical: spacing['5xl'],
    gap:             spacing.md,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: {
    fontSize:    typography.sizes.xl,
    fontWeight:  '700',
    color:       colors.lightMode.text,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize:  typography.sizes.base,
    fontWeight: '500',
    color:     colors.lightMode.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.xl,
  },
});
