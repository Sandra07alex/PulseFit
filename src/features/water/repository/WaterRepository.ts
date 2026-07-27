import { BaseRepository } from '../../../repositories/BaseRepository';
import { WaterLog } from '../models';
import { StorageKeys } from '../../../constants/StorageKeys';
import { Result } from '../../../types';
import { formatDate } from '../../../utils/helpers';

export class WaterRepository extends BaseRepository<WaterLog> {
  constructor() {
    super(StorageKeys.WATER_LOGS);
  }

  /**
   * Retrieves all water logs for a specific date (YYYY-MM-DD format).
   */
  async getByDate(date: string): Promise<Result<WaterLog[]>> {
    const allLogsResult = await this.getAll();
    if (!allLogsResult.success) {
      return allLogsResult;
    }
    const filtered = allLogsResult.data.filter((log) => formatDate(log.loggedAt) === date);
    return { success: true, data: filtered };
  }

  /**
   * Retrieves all water logs for today.
   */
  async getToday(): Promise<Result<WaterLog[]>> {
    const todayStr = formatDate(new Date());
    return this.getByDate(todayStr);
  }

  /**
   * Retrieves water logs within a date range (inclusive, formats: YYYY-MM-DD).
   */
  async getByDateRange(startDate: string, endDate: string): Promise<Result<WaterLog[]>> {
    const allLogsResult = await this.getAll();
    if (!allLogsResult.success) {
      return allLogsResult;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = allLogsResult.data.filter((log) => {
      const loggedTime = new Date(log.loggedAt).getTime();
      return loggedTime >= start.getTime() && loggedTime <= end.getTime();
    });
    return { success: true, data: filtered };
  }
}

export const waterRepository = new WaterRepository();
