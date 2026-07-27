export interface WeightLog {
  id: string;
  userId: string;
  weightKg: number;
  loggedAt: string; // ISO string representing when the weight was logged
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
