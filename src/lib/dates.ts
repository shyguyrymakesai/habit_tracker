/**
 * Format a date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get yesterday's date as YYYY-MM-DD
 */
export function getYesterday(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDate(date);
}

/**
 * Add days to a date
 */
export function addDays(date: Date | string, days: number): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * Subtract days from a date
 */
export function subtractDays(date: Date | string, days: number): string {
  return addDays(date, -days);
}

/**
 * Get start of week
 */
export function getStartOfWeek(date: Date | string, weekStartsOn: 'sunday' | 'monday' = 'monday'): string {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const day = d.getDay();
  const diff = weekStartsOn === 'monday' 
    ? (day === 0 ? -6 : 1 - day)
    : -day;
  d.setDate(d.getDate() + diff);
  return formatDate(d);
}

/**
 * Get end of week
 */
export function getEndOfWeek(date: Date | string, weekStartsOn: 'sunday' | 'monday' = 'monday'): string {
  const startOfWeek = getStartOfWeek(date, weekStartsOn);
  return addDays(startOfWeek, 6);
}

/**
 * Get start of month
 */
export function getStartOfMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  return formatDate(new Date(d.getFullYear(), d.getMonth(), 1));
}

/**
 * Get end of month
 */
export function getEndOfMonth(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  return formatDate(new Date(d.getFullYear(), d.getMonth() + 1, 0));
}

/**
 * Get date range for the last N days
 */
export function getLastNDays(n: number): { start: string; end: string } {
  const end = getToday();
  const start = subtractDays(end, n - 1);
  return { start, end };
}

/**
 * Check if a date is today
 */
export function isToday(date: string): boolean {
  return date === getToday();
}

/**
 * Get day name from date
 */
export function getDayName(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, { weekday: 'long' });
}

/**
 * Get month name from date
 */
export function getMonthName(date: string, locale: string = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, { month: 'long' });
}

/**
 * Get all dates in a range
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
