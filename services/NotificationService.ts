/**
 * NotificationService - Local notification registration and reminder scheduling service interface.
 */
export interface ScheduledReminder {
  id: string;
  title: string;
  body: string;
  hour: number; // 0-23
  minute: number; // 0-59
  enabled: boolean;
}

class NotificationServiceImpl {
  private reminders: ScheduledReminder[] = [];

  async requestPermissions(): Promise<boolean> {
    // Permission request contract
    return true;
  }

  async scheduleReminder(reminder: Omit<ScheduledReminder, 'id'>): Promise<string> {
    const id = `reminder_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullReminder: ScheduledReminder = { ...reminder, id };
    this.reminders.push(fullReminder);
    return id;
  }

  async cancelReminder(id: string): Promise<void> {
    this.reminders = this.reminders.filter((r) => r.id !== id);
  }

  async getScheduledReminders(): Promise<ScheduledReminder[]> {
    return [...this.reminders];
  }
}

export const NotificationService = new NotificationServiceImpl();
