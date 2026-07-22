// Mascot Companion System Types

export type CompanionId = 'droppy' | 'eggsy' | 'brocco' | 'blaze' | 'luna' | 'pulse';

export type CompanionMood = 'idle' | 'celebrate' | 'sad' | 'sleep' | 'wave' | 'thinking';

export type CompanionSize = 'sm' | 'md' | 'lg' | 'xl' | number;

export interface CompanionConfig {
  id: CompanionId;
  name: string;
  domain: string;
  primaryColor: string;
  lightColor: string;
  softColor: string;
  tagline: string;
  personality: string;
}

export interface CompanionProps {
  id?: CompanionId;
  mood?: CompanionMood;
  size?: CompanionSize;
  animated?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
}
