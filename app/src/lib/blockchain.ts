import { getActivityColor } from "./colors";
import {
  format,
  startOfWeek,
  endOfWeek,
  getISOWeeksInYear,
  getYear,
  isSameWeek,
} from "date-fns";

export const WEEKS_PER_YEAR = 52;
export const DAYS_PER_WEEK = 7;
export const GRID_COLUMNS = 53;

export interface ActivityWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  waterActivity: number;
  electricActivity: number;
  combinedActivity: number;
}

export interface ActivityDay {
  date: Date;
  hasWater: boolean;
  hasElectric: boolean;
  activityLevel: number;
}

export function generateActivityGrid(
  year: number = getYear(new Date())
): ActivityWeek[] {
  const weeks: ActivityWeek[] = [];
  const weeksCount = getISOWeeksInYear(new Date(year, 0, 1));

  for (let week = 1; week <= Math.min(weeksCount, WEEKS_PER_YEAR); week++) {
    const weekDate = new Date(year, 0, 1 + (week - 1) * DAYS_PER_WEEK);
    weeks.push({
      weekNumber: week,
      startDate: startOfWeek(weekDate),
      endDate: endOfWeek(weekDate),
      waterActivity: Math.random(),
      electricActivity: Math.random(),
      combinedActivity: Math.random(),
    });
  }

  return weeks;
}

export function calculateActivityLevel(week: ActivityWeek): number {
  return Math.max(week.waterActivity, week.electricActivity);
}

export function getWeekActivityColor(week: ActivityWeek): string {
  const activityLevel = calculateActivityLevel(week);
  return getActivityColor(activityLevel);
}

export function formatBlockchainDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function isActivityThisWeek(week: ActivityWeek, date: Date): boolean {
  return isSameWeek(date, week.startDate, { weekStartsOn: 1 });
}

export function getDayIndexInWeek(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function generateWeeklyActivity(weeks: ActivityWeek[]): ActivityDay[][] {
  return weeks.map((week) => {
    const days: ActivityDay[] = [];
    const current = new Date(week.startDate);

    for (let i = 0; i < DAYS_PER_WEEK; i++) {
      const dayDate = new Date(current);
      dayDate.setDate(current.getDate() + i);

      const hasWater = week.waterActivity > 0.3;
      const hasElectric = week.electricActivity > 0.3;
      const activityLevel = calculateActivityLevel(week);

      days.push({
        date: dayDate,
        hasWater,
        hasElectric,
        activityLevel,
      });
    }

    return days;
  });
}

export function filterActivityByLevel(
  weeks: ActivityWeek[],
  minActivity: number
): ActivityWeek[] {
  return weeks.filter((week) => calculateActivityLevel(week) >= minActivity);
}

export function getActivityStats(weeks: ActivityWeek[]): {
  totalWaterActivity: number;
  totalElectricActivity: number;
  activeWeeks: number;
  averageActivity: number;
} {
  const activeWeeks = weeks.filter((week) => calculateActivityLevel(week) > 0);
  const totalWaterActivity = weeks.reduce(
    (sum, week) => sum + week.waterActivity,
    0
  );
  const totalElectricActivity = weeks.reduce(
    (sum, week) => sum + week.electricActivity,
    0
  );
  const averageActivity =
    weeks.length > 0
      ? weeks.reduce((sum, week) => sum + calculateActivityLevel(week), 0) /
        weeks.length
      : 0;

  return {
    totalWaterActivity,
    totalElectricActivity,
    activeWeeks: activeWeeks.length,
    averageActivity,
  };
}
