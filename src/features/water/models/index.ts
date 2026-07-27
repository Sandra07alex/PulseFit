export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  loggedAt: string; // ISO string representing date/time logged
  createdAt: string;
  updatedAt: string;
}
