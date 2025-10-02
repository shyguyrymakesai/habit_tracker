import localforage from 'localforage';
import { DailyEntry } from './schemas';

// Initialize localForage
const db = localforage.createInstance({
  name: 'habit-tracker',
  storeName: 'entries',
});

/**
 * Save an entry to the database (using date as key)
 */
export async function saveEntry(entry: DailyEntry): Promise<void> {
  await db.setItem(entry.date, entry);
}

/**
 * Get an entry by date (YYYY-MM-DD)
 */
export async function getEntry(date: string): Promise<DailyEntry | null> {
  return await db.getItem<DailyEntry>(date);
}

/**
 * Get all entries
 */
export async function getAllEntries(): Promise<DailyEntry[]> {
  const entries: DailyEntry[] = [];
  await db.iterate<DailyEntry, void>((value: DailyEntry) => {
    entries.push(value);
  });
  return entries.sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Delete an entry by date
 */
export async function deleteEntry(date: string): Promise<void> {
  await db.removeItem(date);
}

/**
 * Clear all data
 */
export async function clearAllData(): Promise<void> {
  await db.clear();
}

/**
 * Get entries within a date range
 */
export async function getEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<DailyEntry[]> {
  const allEntries = await getAllEntries();
  return allEntries.filter(
    (entry) => entry.date >= startDate && entry.date <= endDate
  );
}

/**
 * Check if an entry exists for a date
 */
export async function hasEntry(date: string): Promise<boolean> {
  const entry = await getEntry(date);
  return entry !== null;
}

export default db;
