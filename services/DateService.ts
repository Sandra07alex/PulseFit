/**
 * DateService - Date formatting and calculations helper service.
 */
export const DateService = {
  formatDate(dateInput: Date | string, format: 'short' | 'long' | 'time' | 'iso' = 'short'): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '';

    if (format === 'iso') return date.toISOString();
    if (format === 'time') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (format === 'long') {
      return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  },

  getRelativeTime(dateInput: Date | string): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return this.formatDate(date, 'short');
  },

  isToday(dateInput: Date | string): boolean {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  },
};
