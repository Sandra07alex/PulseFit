import { useState, useCallback } from 'react';
import { CompanionId, CompanionMood } from '../components/mascot/types';
import { CompanionService } from '../services/CompanionService';

export const useCompanion = (initialCompanionId: CompanionId = 'pulse') => {
  const [activeCompanion, setActiveCompanion] = useState<CompanionId>(initialCompanionId);
  const [mood, setMood] = useState<CompanionMood>('idle');

  const celebrate = useCallback(() => {
    setMood('celebrate');
    setTimeout(() => setMood('idle'), 3000);
  }, []);

  const reactSad = useCallback(() => {
    setMood('sad');
    setTimeout(() => setMood('idle'), 3000);
  }, []);

  const wave = useCallback(() => {
    setMood('wave');
    setTimeout(() => setMood('idle'), 2500);
  }, []);

  const getGreeting = useCallback(
    (userName?: string) => CompanionService.getGreeting(activeCompanion, userName),
    [activeCompanion]
  );

  return {
    companionId: activeCompanion,
    setCompanionId: setActiveCompanion,
    mood,
    setMood,
    celebrate,
    reactSad,
    wave,
    getGreeting,
  };
};
