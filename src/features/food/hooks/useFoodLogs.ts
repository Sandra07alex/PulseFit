import { useState, useEffect, useCallback } from 'react';
import { foodRepository } from '../repository/FoodRepository';
import { FoodLog } from '../models';
import { Result } from '../../../types';

/**
 * Hook to manage FoodLogs for a specific date (YYYY-MM-DD).
 */
export function useFoodLogs(dateStr: string) {
  const [logs, setLogs] = useState<FoodLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const res = await foodRepository.getByDate(dateStr);
    if (res.success) {
      setLogs(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  }, [dateStr]);

  const addLog = async (
    log: Omit<FoodLog, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<FoodLog, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<FoodLog>> => {
    const res = await foodRepository.create(log);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const deleteLog = async (id: string): Promise<Result<void>> => {
    const res = await foodRepository.delete(id);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const updateLog = async (id: string, updates: Partial<Omit<FoodLog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Result<FoodLog>> => {
    const res = await foodRepository.update(id, updates);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    refresh: fetchLogs,
    addLog,
    deleteLog,
    updateLog,
  };
}
