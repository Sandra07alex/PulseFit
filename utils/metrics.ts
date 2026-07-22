/**
 * Metric & Mathematical Calculation Utilities
 */

export function calculatePercentage(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
}

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } {
  if (heightCm <= 0 || weightKg <= 0) return { bmi: 0, category: 'Unknown' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 30) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';

  return { bmi, category };
}
