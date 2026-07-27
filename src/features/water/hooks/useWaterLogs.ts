import { useState, useEffect, useCallback } from 'react';
import { waterRepository } from '../repository/WaterRepository';
import { WaterLog } from '../models';
import { Result } from '../../../types';

/**
 * Hook to manage WaterLogs for a specific date (YYYY-MM-DD).
 */
export function useWaterLogs(dateStr: string) {
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const res = await waterRepository.getByDate(dateStr);
    if (res.success) {
      setLogs(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  }, [dateStr]);

  const addLog = async (
    log: Omit<WaterLog, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<WaterLog, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<WaterLog>> => {
    const res = await waterRepository.create(log);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const deleteLog = async (id: string): Promise<Result<void>> => {
    const res = await waterRepository.delete(id);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const updateLog = async (id: string, updates: Partial<Omit<WaterLog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Result<WaterLog>> => {
    const res = await waterRepository.update(id, updates);
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
