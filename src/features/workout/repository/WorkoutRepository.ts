import { BaseRepository } from '../../../repositories/BaseRepository';
import { WorkoutLog } from '../models';
import { StorageKeys } from '../../../constants/StorageKeys';
import { Result } from '../../../types';
import { formatDate } from '../../../utils/helpers';

export class WorkoutRepository extends BaseRepository<WorkoutLog> {
  constructor() {
    super(StorageKeys.WORKOUT_LOGS);
  }

  /**
   * Retrieves all workout logs completed on a specific date (YYYY-MM-DD format).
   */
  async getByDate(date: string): Promise<Result<WorkoutLog[]>> {
    const allLogsResult = await this.getAll();
    if (!allLogsResult.success) {
      return allLogsResult;
    }
    const filtered = allLogsResult.data.filter((log) => formatDate(log.completedAt) === date);
    return { success: true, data: filtered };
  }

  /**
   * Retrieves all workout logs completed today.
   */
  async getToday(): Promise<Result<WorkoutLog[]>> {
    const todayStr = formatDate(new Date());
    return this.getByDate(todayStr);
  }

  /**
   * Retrieves workout logs within a date range (inclusive, formats: YYYY-MM-DD).
   */
  async getByDateRange(startDate: string, endDate: string): Promise<Result<WorkoutLog[]>> {
    const allLogsResult = await this.getAll();
    if (!allLogsResult.success) {
      return allLogsResult;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = allLogsResult.data.filter((log) => {
      const completedTime = new Date(log.completedAt).getTime();
      return completedTime >= start.getTime() && completedTime <= end.getTime();
    });
    return { success: true, data: filtered };
  }
}

export const workoutRepository = new WorkoutRepository();
