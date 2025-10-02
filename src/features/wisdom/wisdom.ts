import { providers } from './providers';
import type { WisdomItem, WisdomSettings, WisdomSource, WisdomWeekLog } from './types';

const LS_SETTINGS = 'wisdom/settings/v1';
const LS_WEEKLOG = 'wisdom/weeklog/v1';

const defaultSettings: WisdomSettings = {
  enabledSources: { bible: true, koan: true, stoic: true, poetry: true },
  preferredBibleTranslation: 'WEB'
};

export function loadSettings(): WisdomSettings {
  try {
    const stored = localStorage.getItem(LS_SETTINGS);
    if (!stored) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(stored) };
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: WisdomSettings) {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(s));
}

function isoWeekKey(date: Date, tz: string): string {
  // Convert to user timezone
  const d = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  
  // ISO week calculation: Mon=0, Sun=6
  const dayNum = (d.getDay() + 6) % 7;
  
  // Find Thursday of this week (ISO weeks are defined by their Thursday)
  d.setDate(d.getDate() - dayNum + 3);
  
  // Get first Thursday of the year
  const firstThursday = new Date(d.getFullYear(), 0, 4);
  
  // Calculate week number
  const week = 1 + Math.round(
    ((d.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
  );
  
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function loadWeekLog(): WisdomWeekLog | null {
  try {
    const stored = localStorage.getItem(LS_WEEKLOG);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveWeekLog(log: WisdomWeekLog) {
  localStorage.setItem(LS_WEEKLOG, JSON.stringify(log));
}

/**
 * Get the daily wisdom item for the given date.
 * Ensures no repeats within the same ISO week.
 */
export async function getDailyWisdom(
  date = new Date(),
  tz = 'America/Indiana/Indianapolis'
): Promise<WisdomItem> {
  const settings = loadSettings();
  const sources = (Object.keys(settings.enabledSources) as WisdomSource[]).filter(
    (s) => settings.enabledSources[s]
  );
  
  if (!sources.length) {
    throw new Error('No wisdom sources enabled');
  }

  const key = isoWeekKey(date, tz);
  let log = loadWeekLog();
  
  if (!log || log.isoWeekKey !== key) {
    // New week - reset the log
    log = { isoWeekKey: key, items: [] };
  }

  // Track which items we've already shown this week
  const shownIds = new Set(log.items.map((i) => i.id));

  // Deterministic selection based on date
  const dateString = date.toISOString().slice(0, 10); // YYYY-MM-DD
  const seed = Number(dateString.replace(/-/g, '')); // YYYYMMDD as number

  // Pick a source based on the seed
  const source = sources[seed % sources.length];
  
  // Get all items from that source
  const allItems = await providers[source]();
  
  // Filter out items we've already shown this week
  const candidates = allItems.filter((i) => !shownIds.has(i.id));
  
  // If we've exhausted all items from this source, reset and use all items
  const pool = candidates.length > 0 ? candidates : allItems;
  
  // Pick an item deterministically
  const item = pool[seed % pool.length];

  // Log this item if it's new
  if (!log.items.find((i) => i.id === item.id)) {
    log.items.push(item);
    saveWeekLog(log);
  }

  return item;
}

/**
 * Force refresh wisdom by clearing cache and fetching new item.
 * Useful for testing or when user wants a new quote.
 * Uses random selection instead of deterministic date-based selection.
 */
export async function refreshDailyWisdom(): Promise<WisdomItem> {
  // Clear API caches to force fresh fetch
  try {
    localStorage.removeItem('wisdom/api-cache/v1/bible');
    localStorage.removeItem('wisdom/api-cache/v1/stoic');
    localStorage.removeItem('wisdom/api-cache/v1/poetry');
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
  
  // Get settings to see which sources are enabled
  const settings = loadSettings();
  const sources = (Object.keys(settings.enabledSources) as WisdomSource[]).filter(
    (s) => settings.enabledSources[s]
  );
  
  if (!sources.length) {
    throw new Error('No wisdom sources enabled');
  }

  // Pick a random source
  const source = sources[Math.floor(Math.random() * sources.length)];
  
  // Get all items from that source
  const allItems = await providers[source]();
  
  // Pick a random item
  const item = allItems[Math.floor(Math.random() * allItems.length)];
  
  return item;
}

/**
 * Get all koans shown this week (for Sunday display).
 */
export function getThisWeeksKoans(tz = 'America/Indiana/Indianapolis'): WisdomItem[] {
  const log = loadWeekLog();
  if (!log) return [];
  
  const key = isoWeekKey(new Date(), tz);
  if (log.isoWeekKey !== key) return [];
  
  return log.items.filter((i) => i.source === 'koan');
}

/**
 * Check if today is Sunday in the given timezone.
 */
export function isSunday(tz = 'America/Indiana/Indianapolis'): boolean {
  const now = new Date();
  const localDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  return localDate.getDay() === 0;
}
