// Date utilities
export const dateUtils = {
  /**
   * Get today's date
   */
  getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  /**
   * Get the start of the week
   */
  getWeekStart(date: Date = new Date()): Date {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Get the start of the month
   */
  getMonthStart(date: Date = new Date()): Date {
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Get the end of the month
   */
  getMonthEnd(date: Date = new Date()): Date {
    const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /**
   * Check if date is today
   */
  isToday(date: Date): boolean {
    const today = this.getToday();
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  },

  /**
   * Get days difference
   */
  getDaysDifference(date1: Date, date2: Date): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  },

  /**
   * Format date to ISO string
   */
  toISOString(date: Date): string {
    return date.toISOString();
  },
};

/**
 * Local calendar-day key (YYYY-MM-DD) in the device's time zone.
 * Use this instead of `toISOString().split('T')[0]`, which is the UTC day and
 * files late-night / early-morning entries under the wrong date.
 */
export function localDateKey(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** True when an ISO timestamp (or YYYY-MM-DD key) falls on the given local day */
export function isOnLocalDay(isoOrKey: string, dayKey: string = localDateKey()): boolean {
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrKey)) return isoOrKey === dayKey;
  return localDateKey(isoOrKey) === dayKey;
}

/** Local day keys for the last `n` days, oldest first, ending today */
export function lastNDayKeys(n: number, from: Date = new Date()): string[] {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(from);
    d.setDate(from.getDate() - (n - 1 - i));
    return localDateKey(d);
  });
}

const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Single-letter weekday for a local day key, e.g. '2026-10-22' → 'T' */
export function weekdayInitial(dayKey: string): string {
  const [y, m, d] = dayKey.split('-').map(Number);
  return WEEKDAY_INITIALS[new Date(y, m - 1, d).getDay()];
}

/** '08:45' style local time for an ISO timestamp */
export function shortTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
