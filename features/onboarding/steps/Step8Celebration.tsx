import React from 'react';
import { CelebrationScreen } from '../components/CelebrationScreen';

export interface Step8CelebrationProps {
  onComplete: () => void;
}

export const Step8Celebration: React.FC<Step8CelebrationProps> = ({ onComplete }) => {
  return <CelebrationScreen onStartJourney={onComplete} />;
};
