import { CompanionId, CompanionMood } from '../components/mascot/types';
import { COMPANION_CONFIGS } from '../components/mascot/Companion';

export interface MascotMessage {
  companionId: CompanionId;
  mood: CompanionMood;
  title: string;
  message: string;
}

class CompanionServiceImpl {
  getGreeting(companionId: CompanionId, userName: string = 'Champion'): MascotMessage {
    const config = COMPANION_CONFIGS[companionId] || COMPANION_CONFIGS.pulse;
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    if (hour >= 12 && hour < 17) timeGreeting = 'Good afternoon';
    if (hour >= 17) timeGreeting = 'Good evening';

    return {
      companionId,
      mood: 'wave',
      title: `${timeGreeting}, ${userName}! 👋`,
      message: `${config.name} is ready! ${config.tagline}`,
    };
  }

  getCelebrationMessage(companionId: CompanionId, goalName: string): MascotMessage {
    const config = COMPANION_CONFIGS[companionId] || COMPANION_CONFIGS.pulse;
    return {
      companionId,
      mood: 'celebrate',
      title: 'Goal Smashed! 🎉',
      message: `You crushed your ${goalName} goal today! ${config.name} is so proud of you!`,
    };
  }

  getEncouragement(companionId: CompanionId): MascotMessage {
    const config = COMPANION_CONFIGS[companionId] || COMPANION_CONFIGS.pulse;
    return {
      companionId,
      mood: 'idle',
      title: 'Keep going! 💪',
      message: `Every small step counts towards your progress. ${config.personality}!`,
    };
  }
}

export const CompanionService = new CompanionServiceImpl();
