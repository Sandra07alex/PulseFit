/**
 * @file useGreeting.ts
 * @description Returns a time-sensitive greeting, emoji, and subtitle based on current hour.
 * Pure computation — no side-effects, no storage reads.
 */

import { useMemo } from 'react';
import type { GreetingData, TimeOfDay } from '../types/dashboard.types';

const SUBTITLES: Record<TimeOfDay, string[]> = {
  morning: [
    'Ready to build another healthy day?',
    'Your best day starts right now! 💪',
    "Let's make today count!",
    'Rise and shine, champion! 🌟',
  ],
  afternoon: [
    "Keep the momentum going!",
    "You're halfway through — stay strong!",
    'Afternoon energy, let\'s channel it! ⚡',
    "Don't lose your stride now!",
  ],
  evening: [
    "Let's finish the day strong! 🔥",
    "Evening hustle hits different!",
    'Time to wrap up your goals 🎯',
    "One last push for the day!",
  ],
  night: [
    'Great work today — time to rest 🌙',
    'Recovery is part of the plan. Sleep well!',
    'Reflect, rest, and recharge ✨',
    "Tomorrow's gains start with tonight's sleep!",
  ],
};

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'evening';
  return 'night';
}

function getEmoji(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':   return '☀️';
    case 'afternoon': return '🌤';
    case 'evening':   return '🌆';
    case 'night':     return '🌙';
  }
}

function getGreeting(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':   return 'Good Morning';
    case 'afternoon': return 'Good Afternoon';
    case 'evening':   return 'Good Evening';
    case 'night':     return 'Good Night';
  }
}

/** Pick a subtitle deterministically per day so it feels "daily-fresh" not random on each render */
function getSubtitle(timeOfDay: TimeOfDay): string {
  const options = SUBTITLES[timeOfDay];
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return options[dayOfYear % options.length];
}

/**
 * Returns greeting data based on the current time.
 * Memoised so it only re-computes when the component mounts.
 */
export function useGreeting(): GreetingData {
  return useMemo<GreetingData>(() => {
    const hour = new Date().getHours();
    const timeOfDay = getTimeOfDay(hour);
    return {
      greeting: getGreeting(timeOfDay),
      emoji: getEmoji(timeOfDay),
      subtitle: getSubtitle(timeOfDay),
      timeOfDay,
    };
  }, []);
}
