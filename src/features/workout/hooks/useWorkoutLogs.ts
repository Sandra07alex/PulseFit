import { useState, useEffect, useCallback } from 'react';
import { workoutRepository } from '../repository/WorkoutRepository';
import { WorkoutLog } from '../models';
import { Result } from '../../../types';

/**
 * Hook to manage WorkoutLogs for a specific date (YYYY-MM-DD).
 */
export function useWorkoutLogs(dateStr: string) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const res = await workoutRepository.getByDate(dateStr);
    if (res.success) {
      setLogs(res.data);
      setError(null);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  }, [dateStr]);

  const addLog = async (
    log: Omit<WorkoutLog, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<WorkoutLog, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Result<WorkoutLog>> => {
    const res = await workoutRepository.create(log);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const deleteLog = async (id: string): Promise<Result<void>> => {
    const res = await workoutRepository.delete(id);
    if (res.success) {
      await fetchLogs();
    }
    return res;
  };

  const updateLog = async (id: string, updates: Partial<Omit<WorkoutLog, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Result<WorkoutLog>> => {
    const res = await workoutRepository.update(id, updates);
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
