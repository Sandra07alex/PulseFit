// Goals types
export interface GoalMetrics {
  weight?: number;
  steps?: number;
  calories?: number;
  workouts?: number;
  water?: number;
}

export interface GoalProgress {
  goalId: string;
  current: number;
  target: number;
  percentage: number;
  daysRemaining?: number;
}
