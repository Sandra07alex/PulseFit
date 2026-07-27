import { foodRepository } from '../features/food/repository/FoodRepository';
import { waterRepository } from '../features/water/repository/WaterRepository';
import { workoutRepository } from '../features/workout/repository/WorkoutRepository';
import { weightRepository } from '../features/weight/repository/WeightRepository';

/**
 * Seeds mockup FoodLogs for testing.
 */
export async function seedFoodLogs(): Promise<void> {
  await foodRepository.clear();
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Seed breakfast, lunch, snack, dinner
    await foodRepository.create({
      userId: 'test-user-id',
      name: 'Oatmeal with Blueberries',
      calories: 320,
      proteinGrams: 12,
      carbsGrams: 55,
      fatGrams: 6,
      servingSize: '1 bowl',
      servingCount: 1,
      mealType: 'Breakfast',
      loggedAt: `${dateString}T08:30:00.000Z`,
    });

    await foodRepository.create({
      userId: 'test-user-id',
      name: 'Grilled Chicken & Quinoa',
      calories: 480,
      proteinGrams: 38,
      carbsGrams: 42,
      fatGrams: 12,
      servingSize: '1 plate',
      servingCount: 1,
      mealType: 'Lunch',
      loggedAt: `${dateString}T13:15:00.000Z`,
    });

    await foodRepository.create({
      userId: 'test-user-id',
      name: 'Whey Protein Shake',
      calories: 180,
      proteinGrams: 26,
      carbsGrams: 4,
      fatGrams: 2,
      servingSize: '1 glass',
      servingCount: 1,
      mealType: 'Snack',
      loggedAt: `${dateString}T16:00:00.000Z`,
    });

    await foodRepository.create({
      userId: 'test-user-id',
      name: 'Pan-Seared Salmon & Broccoli',
      calories: 520,
      proteinGrams: 40,
      carbsGrams: 18,
      fatGrams: 26,
      servingSize: '1 plate',
      servingCount: 1,
      mealType: 'Dinner',
      loggedAt: `${dateString}T19:30:00.000Z`,
    });
  }
}

/**
 * Seeds mockup WaterLogs for testing.
 */
export async function seedWaterLogs(): Promise<void> {
  await waterRepository.clear();
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Seed multiple water entries per day (total ~2000ml)
    const amounts = [250, 500, 500, 250, 500];
    for (let j = 0; j < amounts.length; j++) {
      const hour = 8 + j * 2.5; // distributes from 08:00 to 18:00
      await waterRepository.create({
        userId: 'test-user-id',
        amountMl: amounts[j],
        loggedAt: `${dateString}T${String(Math.floor(hour)).padStart(2, '0')}:00:00.000Z`,
      });
    }
  }
}

/**
 * Seeds mockup WorkoutLogs for testing.
 */
export async function seedWorkoutLogs(): Promise<void> {
  await workoutRepository.clear();
  const today = new Date();
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Seed 1 workout every other day
    if (i % 2 === 0) {
      await workoutRepository.create({
        userId: 'test-user-id',
        title: i === 0 ? 'Full Body Strength' : i === 2 ? 'Cardio HIIT Run' : 'Vinyasa Yoga Flow',
        category: i === 0 ? 'Strength' : i === 2 ? 'Cardio' : 'Flexibility',
        durationMinutes: i === 0 ? 45 : i === 2 ? 30 : 60,
        caloriesBurned: i === 0 ? 380 : i === 2 ? 420 : 200,
        intensity: i === 0 ? 'High' : i === 2 ? 'Extreme' : 'Low',
        notes: 'Felt strong, steady progress.',
        completedAt: `${dateString}T17:30:00.000Z`,
      });
    }
  }
}

/**
 * Seeds mockup WeightLogs for testing.
 */
export async function seedWeightLogs(): Promise<void> {
  await weightRepository.clear();
  const today = new Date();
  
  const startingWeight = 81.2;
  for (let i = 4; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    // Steady weight decrease over the last 5 days
    const weight = startingWeight - (4 - i) * 0.25;
    await weightRepository.create({
      userId: 'test-user-id',
      weightKg: parseFloat(weight.toFixed(2)),
      loggedAt: `${dateString}T07:00:00.000Z`,
      notes: 'Morning weigh-in',
    });
  }
}

/**
 * Master seed utility.
 */
export async function seedAll(): Promise<void> {
  await seedFoodLogs();
  await seedWaterLogs();
  await seedWorkoutLogs();
  await seedWeightLogs();
}
