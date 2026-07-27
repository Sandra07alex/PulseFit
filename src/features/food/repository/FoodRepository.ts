import { BaseRepository } from '../../../repositories/BaseRepository';
import { FoodLog } from '../models';
import { StorageKeys } from '../../../constants/StorageKeys';
import { Result } from '../../../types';
import { formatDate } from '../../../utils/helpers';

export class FoodRepository extends BaseRepository<FoodLog> {
  constructor() {
    super(StorageKeys.FOOD_LOGS);
  }

  /**
   * Retrieves all food logs entered on a specific date (YYYY-MM-DD format).
   */
  async getByDate(date: string): Promise<Result<FoodLog[]>> {
    const allLogsResult = await this.getAll();
    if (!allLogsResult.success) {
      return allLogsResult;
    }
    const filtered = allLogsResult.data.filter((log) => formatDate(log.loggedAt) === date);
    return { success: true, data: filtered };
  }

  /**
   * Retrieves all food logs entered today.
   */
  async getToday(): Promise<Result<FoodLog[]>> {
    const todayStr = formatDate(new Date());
    return this.getByDate(todayStr);
  }

  /**
   * Retrieves food logs within a date range (inclusive, formats: YYYY-MM-DD).
   */
  async getByDateRange(startDate: string, endDate: string): Promise<Result<FoodLog[]>> {
    const allLogsResult = await this.getAll();
    if (!allLogsResult.success) {
      return allLogsResult;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Include full end day

    const filtered = allLogsResult.data.filter((log) => {
      const loggedTime = new Date(log.loggedAt).getTime();
      return loggedTime >= start.getTime() && loggedTime <= end.getTime();
    });
    return { success: true, data: filtered };
  }
}

export const foodRepository = new FoodRepository();
