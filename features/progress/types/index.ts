// Progress types
export interface BodyMeasurement {
  date: Date;
  weight?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  thighs?: number;
  arms?: number;
}

export interface ProgressPhoto {
  id: string;
  date: Date;
  photoUrl: string;
  notes?: string;
}

export interface ProgressMetrics {
  startDate: Date;
  currentDate: Date;
  startWeight?: number;
  currentWeight?: number;
  weightChange?: number;
  photos: ProgressPhoto[];
  measurements: BodyMeasurement[];
}
