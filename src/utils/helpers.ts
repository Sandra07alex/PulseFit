/**
 * Reusable helper utilities for PulseFit data management.
 */

/**
 * Generates an RFC4122 v4 compliant UUID in a pure JavaScript environment.
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Formats a Date object or ISO string to YYYY-MM-DD format.
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function getTodayDateString(): string {
  return formatDate(new Date());
}

/**
 * Returns the YYYY-MM-DD start (Monday) and end (Sunday) dates of the week for a given date.
 */
export function getWeekRange(date: Date = new Date()): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  // Adjust so Monday is 1, Sunday is 7
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  return {
    start: formatDate(monday),
    end: formatDate(sunday),
  };
}

/**
 * Returns the YYYY-MM-DD start (1st) and end (last day) dates of the month for a given date.
 */
export function getMonthRange(date: Date = new Date()): { start: string; end: string } {
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  
  return {
    start: formatDate(firstDay),
    end: formatDate(lastDay),
  };
}

/**
 * Sorts logs chronologically by their loggedAt, completedAt, or createdAt fields.
 */
export function sortLogsByDate<T extends { loggedAt?: string; completedAt?: string; createdAt?: string }>(
  logs: T[],
  ascending: boolean = false
): T[] {
  return [...logs].sort((a, b) => {
    const dateA = new Date(a.loggedAt || a.completedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.loggedAt || b.completedAt || b.createdAt || 0).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Groups logs by date in YYYY-MM-DD format.
 */
export function groupLogsByDay<T extends { loggedAt?: string; completedAt?: string; createdAt?: string }>(
  logs: T[]
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const log of logs) {
    const dateStr = formatDate(log.loggedAt || log.completedAt || log.createdAt || new Date());
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(log);
  }
  return groups;
}

/**
 * Sums the numeric values of a specific key across an array of items.
 */
export function calculateTotal<T>(items: T[], key: keyof T): number {
  return items.reduce((sum, item) => {
    const value = item[key];
    const num = typeof value === 'number' ? value : Number(value);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
}
