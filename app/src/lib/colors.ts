import {
  ACTIVITY_RATIO_COLORS,
  ELECTRIC_METER_COLORS,
  INACTIVE_COLOR,
  ELECTRIC_COLOR,
  WATER_COLOR,
} from "../constants";

const ACTIVITY_THRESHOLDS = {
  low: 0.3,
  medium: 0.6,
  high: 0.8,
};

export function getActivityColor(ratio: number): string {
  if (ratio <= 0) return INACTIVE_COLOR;

  if (ratio <= ACTIVITY_THRESHOLDS.low) return ACTIVITY_RATIO_COLORS.low;
  if (ratio <= ACTIVITY_THRESHOLDS.medium) return ACTIVITY_RATIO_COLORS.medium;
  if (ratio <= ACTIVITY_THRESHOLDS.high) return ACTIVITY_RATIO_COLORS.high;

  return ACTIVITY_RATIO_COLORS.very_high;
}

export function getElectricMeterColor(ratio: number): string {
  if (ratio <= 0) return INACTIVE_COLOR;
  if (ratio >= 1) return ELECTRIC_METER_COLORS[ELECTRIC_METER_COLORS.length - 1].color;

  const level = ELECTRIC_METER_COLORS.find((level) => ratio <= level.ratio);

  return level ? level.color : ELECTRIC_METER_COLORS[0].color;
}

export function getWaterColor(): string {
  return WATER_COLOR;
}

export function getElectricColor(): string {
  return ELECTRIC_COLOR;
}

export function getInactiveColor(): string {
  return INACTIVE_COLOR;
}
