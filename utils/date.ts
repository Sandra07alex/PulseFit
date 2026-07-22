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
