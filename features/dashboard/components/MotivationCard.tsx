/**
 * @file MotivationCard.tsx
 * @description ❤️ Pulse Says motivation card.
 *
 * Features:
 *  - Displays a time-based quote from QuoteService on mount
 *  - Fade animation on quote swap
 *  - Category pill
 *  - "🔄 New Quote" button with bounce
 *  - Glassmorphism card style
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { QuoteService } from '../../../services/QuoteService';
import { usePressAnimation } from '../../../hooks/useMotion';
import { colors } from '../../../theme/colors';
import { radius } from '../../../theme/radius';
import { spacing } from '../../../theme/spacing';
import { shadows } from '../../../theme/shadows';
import type { Quote } from '../../../types/models';

// ---------------------------------------------------------------------------
// Category colour mapping
// ---------------------------------------------------------------------------

const CATEGORY_COLORS: Record<string, string> = {
  Motivation:   colors.primary,
  Funny:        colors.companions.eggsy.primary,
  Workout:      colors.companions.blaze.primary,
  Food:         colors.companions.brocco.primary,
  Water:        colors.companions.droppy.primary,
  Consistency:  colors.companions.luna.primary,
  Pulse:        colors.companions.pulse.primary,
  Morning:      '#FF9F0A',
  Night:        '#5E5CE6',
  Random:       colors.gray500,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const MotivationCard: React.FC = () => {
  const [quote, setQuote]         = useState<Quote>(() => QuoteService.getTimeBasedQuote());
  const fadeAnim                   = useRef(new Animated.Value(1)).current;
  const { scale, handlePressIn, handlePressOut } = usePressAnimation(0.95);

  const categoryColor = CATEGORY_COLORS[quote.category] ?? colors.primary;

  const handleNewQuote = useCallback(() => {
    // Fade out → swap → fade in
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      const next = QuoteService.rotateQuote(quote.id);
      setQuote(next);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [quote.id, fadeAnim]);

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Text style={styles.pulse}>❤️</Text>
          <Text style={styles.cardTitle}>Pulse Says</Text>
        </View>
        {/* Category pill */}
        <View style={[styles.categoryPill, { backgroundColor: categoryColor + '20' }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {quote.category}
          </Text>
        </View>
      </View>

      {/* Quote text */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.quoteText}>"{quote.text}"</Text>
        {quote.author && (
          <Text style={styles.authorText}>— {quote.author}</Text>
        )}
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* New quote button */}
      <Animated.View style={{ transform: [{ scale }], alignSelf: 'flex-start' }}>
        <TouchableOpacity
          style={styles.newQuoteButton}
          onPress={handleNewQuote}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          accessibilityLabel="Get a new quote"
          accessibilityRole="button"
        >
          <Text style={styles.newQuoteIcon}>🔄</Text>
          <Text style={styles.newQuoteLabel}>New Quote</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.lightMode.surface,
    borderRadius: radius.heroCard,
    padding: spacing['2xl'],
    marginHorizontal: spacing.screenPadding,
    gap: spacing.md,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    // Subtle gradient hint via border
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulse: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.lightMode.text,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
  authorText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.lightMode.textSecondary,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray100,
  },
  newQuoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
  },
  newQuoteIcon: {
    fontSize: 14,
  },
  newQuoteLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
