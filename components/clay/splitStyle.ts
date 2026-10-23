import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

const OUTER_KEYS = new Set<string>([
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'marginHorizontal', 'marginVertical', 'marginStart', 'marginEnd',
  'width', 'minWidth', 'maxWidth', 'flex', 'flexGrow', 'flexShrink', 'flexBasis',
  'alignSelf', 'position', 'top', 'bottom', 'left', 'right', 'zIndex', 'opacity', 'transform',
]);

/** Ignored on clay surfaces: shadows/borders are part of the clay look */
const DROP_KEYS = new Set<string>([
  'shadowColor', 'shadowOffset', 'shadowOpacity', 'shadowRadius', 'elevation',
  'borderWidth', 'borderColor', 'borderTopWidth', 'borderTopColor', 'borderRadius',
]);

/**
 * Split a legacy card style into the wrapper part (layout in the parent)
 * and the face part (padding, alignment, background).
 */
export function splitStyle(style: StyleProp<ViewStyle>): { outer: ViewStyle; inner: ViewStyle } {
  const flat = (StyleSheet.flatten(style) ?? {}) as Record<string, unknown>;
  const outer: Record<string, unknown> = {};
  const inner: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(flat)) {
    if (OUTER_KEYS.has(k)) outer[k] = v;
    else if (!DROP_KEYS.has(k)) inner[k] = v;
  }
  // a fixed height belongs to the face so the lip stays underneath
  return { outer: outer as ViewStyle, inner: inner as ViewStyle };
}

/** Pull a borderRadius out of a legacy style, if one was set */
export function radiusOf(style: StyleProp<ViewStyle>, fallback: number): number {
  const r = (StyleSheet.flatten(style) ?? {}).borderRadius;
  return typeof r === 'number' ? r : fallback;
}
