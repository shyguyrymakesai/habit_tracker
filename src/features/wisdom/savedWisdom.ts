import type { WisdomItem, SavedWisdomItem } from './types';

const LS_SAVED_WISDOM = 'wisdom/saved/v1';

export function getSavedWisdom(): SavedWisdomItem[] {
  try {
    const saved = localStorage.getItem(LS_SAVED_WISDOM);
    if (!saved) return [];
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function saveWisdomItem(item: WisdomItem): void {
  try {
    const saved = getSavedWisdom();
    
    // Check if already saved
    if (saved.some(s => s.id === item.id)) {
      return; // Already saved
    }
    
    const savedItem: SavedWisdomItem = {
      ...item,
      savedAt: Date.now()
    };
    
    saved.unshift(savedItem); // Add to beginning
    localStorage.setItem(LS_SAVED_WISDOM, JSON.stringify(saved));
  } catch (error) {
    console.error('Failed to save wisdom item:', error);
  }
}

export function unsaveWisdomItem(id: string): void {
  try {
    const saved = getSavedWisdom();
    const filtered = saved.filter(s => s.id !== id);
    localStorage.setItem(LS_SAVED_WISDOM, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to unsave wisdom item:', error);
  }
}

export function isWisdomItemSaved(id: string): boolean {
  const saved = getSavedWisdom();
  return saved.some(s => s.id === id);
}
