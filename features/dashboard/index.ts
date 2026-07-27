/**
 * @file index.ts
 * @description Barrel export for the dashboard feature module.
 * Import from 'features/dashboard' to access all public API.
 */

// Components
export { DashboardHeader }    from './components/DashboardHeader';
export { MotivationCard }     from './components/MotivationCard';
export { ProgressCard }       from './components/ProgressCard';
export { ProgressCardGrid }   from './components/ProgressCardGrid';
export { SummarySection }     from './components/SummarySection';
export { QuickActionsGrid, QUICK_ACTIONS } from './components/QuickActionsGrid';
export { StreakCard }          from './components/StreakCard';
export { RecentActivityList }  from './components/RecentActivityList';
export { DashboardEmptyState } from './components/DashboardEmptyState';

// Hooks
export { useDashboardData }   from './hooks/useDashboardData';
export { useGreeting }        from './hooks/useGreeting';
export { useDailyScore }      from './hooks/useDailyScore';
export { useStreak }          from './hooks/useStreak';

// Types
export type {
  GreetingData,
  TimeOfDay,
  MetricId,
  MetricProgress,
  DailyScoreData,
  TodaySummaryData,
  StreakData,
  StreakRecord,
  RecentActivityEntry,
  ActivityType,
  QuickAction,
  DashboardData,
} from './types/dashboard.types';
