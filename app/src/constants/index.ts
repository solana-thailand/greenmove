export const INACTIVE_COLOR = '#9ca3af';
export const WATER_COLOR = '#3b82f6';
export const ELECTRIC_COLOR = '#f59e0b';

export const ACTIVITY_RATIO_COLORS = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  very_high: '#7c3aed',
} as const;

export const ELECTRIC_METER_COLORS = [
  { ratio: 0, color: '#3b82f6' },
  { ratio: 0.33, color: '#6366f1' },
  { ratio: 0.66, color: '#8b5cf6' },
  { ratio: 1, color: '#f59e0b' },
] as const;
