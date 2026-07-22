import { Limits } from '../constants/Limits';

export const WaterCalculator = {
  calculateDailyTargetMl(
    weightKg: number = 70,
    activityMinutesDaily: number = 30,
    isHotClimate: boolean = false
  ): number {
    let baseMl = weightKg * 35; // 35ml per kg
    const activityMl = (activityMinutesDaily / 30) * 350;
    const climateMl = isHotClimate ? 500 : 0;

    const total = Math.round(baseMl + activityMl + climateMl);
    return Math.min(Limits.WATER.MAX_DAILY_ML, Math.max(Limits.WATER.MIN_DAILY_ML, total));
  },
};
