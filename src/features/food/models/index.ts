export interface Food {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  servingSize: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodLog {
  id: string;
  userId: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  servingSize: string;
  servingCount: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  loggedAt: string; // ISO String representation of when it was logged
  createdAt: string;
  updatedAt: string;
}
