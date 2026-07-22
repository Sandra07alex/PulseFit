// Profile types
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goal?: 'weightLoss' | 'weightGain' | 'maintenance';
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  language: string;
  units: 'metric' | 'imperial';
}
