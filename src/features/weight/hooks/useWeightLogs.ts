import { useState, useEffect, useCallback } from 'react';
import { weightRepository } from '../repository/WeightRepository';
import { WeightLog } from '../models';
import { Result } from '../../../types';

/**
 * Hook to manage WeightLogs.
 */
export function useWeightLogs() {
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const res = await weightRepository.getAll();
    if (res.success) {
      // Sort logs by date (most recent first)
      const sorted = [...res.data].sort((a, b) => new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime());
      setLogs(sorted);
      setError(null);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  }, []);

  const addLog = async (
    log: Omit<WeightLog, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<WeightLog, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<WeightLog>> => {
    const res = await weightRepository.create(log);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const deleteLog = async (id: string): Promise<Result<void>> => {
    const res = await weightRepository.delete(id);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const updateLog = async (id: string, updates: Partial<Omit<WeightLog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Result<WeightLog>> => {
    const res = await weightRepository.update(id, updates);
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
