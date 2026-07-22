// Shared Icon & Emoji Map Constants

export const Icons = {
  // Domain icons
  water: '💧',
  protein: '🥚',
  nutrition: '🥦',
  workout: '🔥',
  sleep: '🌙',
  coach: '❤️',
  weight: '⚖️',
  target: '🎯',
  trophy: '🏆',
  fire: '🔥',
  heart: '❤️',
  star: '⭐',

  // Category icons
  cardio: '🏃',
  strength: '🏋️',
  flexibility: '🧘',
  biking: '🚴',
  swimming: '🏊',

  // Meal icons
  breakfast: '🍳',
  lunch: '🥗',
  dinner: '🍲',
  snack: '🍎',

  // Navigation icons
  home: '🏠',
  activity: '🔥',
  profile: '👤',
  settings: '⚙️',
  search: '🔍',
  close: '✕',
} as const;

export type IconKey = keyof typeof Icons;
