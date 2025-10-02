export type WisdomSource = 'bible' | 'koan' | 'stoic' | 'poetry';

export interface WisdomItem {
  id: string;              // stable ID (e.g., 'koan:mu-gate')
  source: WisdomSource;
  title?: string;          // e.g., "Joshu's Mu" or "Psalm 23:1"
  text: string;            // display body
  ref?: string;            // verse ref or source ref
  attribution?: string;    // author/translator if relevant
}

export interface SavedWisdomItem extends WisdomItem {
  savedAt: number;         // timestamp when saved
}

export interface WisdomSettings {
  enabledSources: Record<WisdomSource, boolean>;
  preferredBibleTranslation?: 'KJV' | 'ASV' | 'WEB'; // optional
}

export interface WisdomWeekLog {
  isoWeekKey: string;      // e.g., '2025-W40'
  items: WisdomItem[];     // items shown this ISO week
}
