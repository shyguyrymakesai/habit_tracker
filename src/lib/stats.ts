import { DailyEntry } from './schemas';

/**
 * Calculate the current streak based on consecutive days with entries.
 */
export function calculateStreak(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}

/**
 * Calculate rolling average for a rating by ID.
 */
export function calculateRatingRollingAverage(
  entries: DailyEntry[],
  ratingId: string,
  days: number = 7
): number {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const recentEntries = sortedEntries.slice(0, days);

  const ratingValues = recentEntries
    .map((entry) => entry.ratings.find((rating) => rating.ratingId === ratingId)?.value)
    .filter((value): value is number => typeof value === 'number');

  if (ratingValues.length === 0) return 0;

  const sum = ratingValues.reduce((total, value) => total + value, 0);
  return sum / ratingValues.length;
}

/**
 * Get completion rate for the specified date range (percentage of days with an entry).
 */
export function getCompletionRate(
  entries: DailyEntry[],
  startDate: string,
  endDate: string
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  const entriesInRange = entries.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  );

  return (entriesInRange.length / totalDays) * 100;
}

/**
 * Get best streak from all entries
 */
export function getBestStreak(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;

  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  let bestStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < sortedEntries.length; i++) {
    const prevDate = new Date(sortedEntries[i - 1].date);
    const currDate = new Date(sortedEntries[i].date);

    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return Math.max(bestStreak, currentStreak);
}

/**
 * Get statistics for a specific rating (min, max, average, total sum).
 */
export function getRatingStats(entries: DailyEntry[], ratingId: string) {
  const values = entries
    .map((entry) => entry.ratings.find((rating) => rating.ratingId === ratingId)?.value)
    .filter((value): value is number => typeof value === 'number');

  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, total: 0 };
  }

  const total = values.reduce((sum, val) => sum + val, 0);
  const avg = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);

  return { min, max, avg, total };
}

/**
 * Calculate habit completion rate within a date range.
 */
export function getHabitCompletionRate(
  entries: DailyEntry[],
  habitId: string,
  startDate: string,
  endDate: string
): number {
  const entriesInRange = entries.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  );

  if (entriesInRange.length === 0) return 0;

  const completedCount = entriesInRange.reduce((count, entry) => {
    const habitLog = entry.habits.find((habit) => habit.habitId === habitId);
    if (!habitLog) return count;

    if (habitLog.completed) return count + 1;
    if (habitLog.minutes && habitLog.minutes > 0) return count + 1;
    return count;
  }, 0);

  return (completedCount / entriesInRange.length) * 100;
}
