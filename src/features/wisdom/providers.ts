import koansData from './data/koans.json';
import stoicData from './data/stoic.json';
import poetryData from './data/poetry.json';
import type { WisdomItem, WisdomSource } from './types';

export type Provider = () => Promise<WisdomItem[]>;

const fromStatic = (items: WisdomItem[]): Provider => async () => items;

// Cache for API responses
const API_CACHE_KEY = 'wisdom/api-cache/v1';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  timestamp: number;
  items: WisdomItem[];
}

function getCachedData(source: WisdomSource): WisdomItem[] | null {
  try {
    const cached = localStorage.getItem(`${API_CACHE_KEY}/${source}`);
    if (!cached) return null;
    
    const data: CachedData = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - data.timestamp < CACHE_TTL) {
      return data.items;
    }
    
    // Cache expired
    localStorage.removeItem(`${API_CACHE_KEY}/${source}`);
    return null;
  } catch {
    return null;
  }
}

function setCachedData(source: WisdomSource, items: WisdomItem[]): void {
  try {
    const data: CachedData = {
      timestamp: Date.now(),
      items
    };
    localStorage.setItem(`${API_CACHE_KEY}/${source}`, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to cache ${source} data:`, error);
  }
}

// Bible verses - small seed set with option to expand via API later
const bibleVerses: WisdomItem[] = [
  {
    id: 'bible:ps23-1',
    source: 'bible',
    title: 'Psalm 23:1',
    text: 'The Lord is my shepherd; I shall not want.',
    ref: 'Psalm 23:1',
    attribution: 'WEB'
  },
  {
    id: 'bible:prov3-5-6',
    source: 'bible',
    title: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart, and don\'t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.',
    ref: 'Proverbs 3:5-6',
    attribution: 'WEB'
  },
  {
    id: 'bible:phil4-13',
    source: 'bible',
    title: 'Philippians 4:13',
    text: 'I can do all things through Christ, who strengthens me.',
    ref: 'Philippians 4:13',
    attribution: 'WEB'
  },
  {
    id: 'bible:ps46-10',
    source: 'bible',
    title: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
    ref: 'Psalm 46:10',
    attribution: 'WEB'
  },
  {
    id: 'bible:matt11-28',
    source: 'bible',
    title: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
    ref: 'Matthew 11:28',
    attribution: 'WEB'
  },
  {
    id: 'bible:jer29-11',
    source: 'bible',
    title: 'Jeremiah 29:11',
    text: 'For I know the plans that I have for you, says the Lord, plans for peace, and not for evil, to give you hope and a future.',
    ref: 'Jeremiah 29:11',
    attribution: 'WEB'
  },
  {
    id: 'bible:rom8-28',
    source: 'bible',
    title: 'Romans 8:28',
    text: 'We know that all things work together for good for those who love God, for those who are called according to his purpose.',
    ref: 'Romans 8:28',
    attribution: 'WEB'
  },
  {
    id: 'bible:ps27-1',
    source: 'bible',
    title: 'Psalm 27:1',
    text: 'The Lord is my light and my salvation. Whom shall I fear? The Lord is the strength of my life. Of whom shall I be afraid?',
    ref: 'Psalm 27:1',
    attribution: 'WEB'
  },
  {
    id: 'bible:isa41-10',
    source: 'bible',
    title: 'Isaiah 41:10',
    text: 'Don\'t be afraid, for I am with you. Don\'t be dismayed, for I am your God. I will strengthen you. Yes, I will help you. Yes, I will uphold you with the right hand of my righteousness.',
    ref: 'Isaiah 41:10',
    attribution: 'WEB'
  },
  {
    id: 'bible:john14-27',
    source: 'bible',
    title: 'John 14:27',
    text: 'Peace I leave with you. My peace I give to you; not as the world gives, I give to you. Don\'t let your heart be troubled, neither let it be fearful.',
    ref: 'John 14:27',
    attribution: 'WEB'
  }
];

/**
 * Generate a random Bible verse reference
 * Uses common books and reasonable chapter/verse ranges
 */
function getRandomVerseReference(): string {
  const books = [
    { name: 'Genesis', chapters: 50, avgVerses: 30 },
    { name: 'Exodus', chapters: 40, avgVerses: 30 },
    { name: 'Psalms', chapters: 150, avgVerses: 15 },
    { name: 'Proverbs', chapters: 31, avgVerses: 25 },
    { name: 'Isaiah', chapters: 66, avgVerses: 25 },
    { name: 'Jeremiah', chapters: 52, avgVerses: 30 },
    { name: 'Matthew', chapters: 28, avgVerses: 30 },
    { name: 'Mark', chapters: 16, avgVerses: 35 },
    { name: 'Luke', chapters: 24, avgVerses: 40 },
    { name: 'John', chapters: 21, avgVerses: 30 },
    { name: 'Acts', chapters: 28, avgVerses: 35 },
    { name: 'Romans', chapters: 16, avgVerses: 25 },
    { name: 'Corinthians', chapters: 16, avgVerses: 30, prefix: '1 ' },
    { name: 'Corinthians', chapters: 13, avgVerses: 15, prefix: '2 ' },
    { name: 'Ephesians', chapters: 6, avgVerses: 25 },
    { name: 'Philippians', chapters: 4, avgVerses: 20 },
    { name: 'Colossians', chapters: 4, avgVerses: 18 },
    { name: 'Thessalonians', chapters: 5, avgVerses: 20, prefix: '1 ' },
    { name: 'Timothy', chapters: 6, avgVerses: 18, prefix: '1 ' },
    { name: 'Hebrews', chapters: 13, avgVerses: 25 },
    { name: 'James', chapters: 5, avgVerses: 20 },
    { name: 'Peter', chapters: 5, avgVerses: 20, prefix: '1 ' },
    { name: 'John', chapters: 5, avgVerses: 15, prefix: '1 ' },
    { name: 'Revelation', chapters: 22, avgVerses: 20 }
  ];

  const book = books[Math.floor(Math.random() * books.length)];
  const chapter = Math.floor(Math.random() * book.chapters) + 1;
  const verse = Math.floor(Math.random() * book.avgVerses) + 1;
  
  const bookName = (book.prefix || '') + book.name;
  return `${bookName} ${chapter}:${verse}`;
}

/**
 * Fetch Bible verses from bible-api.com
 * Fetches truly random verses from various books
 * Falls back to local data if API fails
 */
async function fetchBibleVerses(): Promise<WisdomItem[]> {
  // Check cache first
  const cached = getCachedData('bible');
  if (cached) return cached;

  try {
    // Fetch multiple random verses to build up a collection
    const numVersesToFetch = 5;
    const fetchPromises: Promise<WisdomItem | null>[] = [];

    for (let i = 0; i < numVersesToFetch; i++) {
      const verseRef = getRandomVerseReference();
      
      fetchPromises.push(
        fetch(`https://bible-api.com/${encodeURIComponent(verseRef)}?translation=kjv`)
          .then(async (response) => {
            if (!response.ok) return null;
            const data = await response.json();
            
            // Some verses might not exist or be too long
            if (!data.text || data.text.length > 500) return null;
            
            return {
              id: `bible:api-${data.reference.replace(/\s+/g, '-').toLowerCase()}`,
              source: 'bible' as WisdomSource,
              title: data.reference,
              text: data.text.trim(),
              ref: data.reference,
              attribution: data.translation_name || 'KJV'
            };
          })
          .catch(() => null)
      );
    }

    const results = await Promise.all(fetchPromises);
    const apiVerses = results.filter((v): v is WisdomItem => v !== null);

    if (apiVerses.length > 0) {
      // Combine with local verses for variety
      const combined = [...bibleVerses, ...apiVerses];
      setCachedData('bible', combined);
      return combined;
    }
    
    throw new Error('No valid verses fetched');
  } catch (error) {
    console.warn('Bible API failed, using offline data:', error);
    return bibleVerses;
  }
}

/**
 * Fetch Stoic quotes from Stoic Quotes API
 * Falls back to local data if API fails
 */
async function fetchStoicQuotes(): Promise<WisdomItem[]> {
  // Check cache first
  const cached = getCachedData('stoic');
  if (cached) return cached;

  try {
    // Try stoic-quotes API (free, no auth required)
    const response = await fetch('https://stoic-quotes.com/api/quotes');
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      const apiQuotes: WisdomItem[] = data.slice(0, 20).map((quote: any, index: number) => ({
        id: `stoic:api-${index}`,
        source: 'stoic' as WisdomSource,
        text: quote.text || quote.quote,
        attribution: quote.author,
        ref: quote.source || undefined
      }));

      // Combine with local quotes
      const combined = [...stoicData as WisdomItem[], ...apiQuotes];
      setCachedData('stoic', combined);
      return combined;
    }
    
    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Stoic API failed, using offline data:', error);
    return stoicData as WisdomItem[];
  }
}

/**
 * Fetch Poetry from PoetryDB API
 * Falls back to local data if API fails
 */
async function fetchPoetry(): Promise<WisdomItem[]> {
  // Check cache first
  const cached = getCachedData('poetry');
  if (cached) return cached;

  try {
    // Try PoetryDB API (free, no auth required)
    // Get random poems from famous poets
    const poets = ['Emily Dickinson', 'Robert Frost', 'Walt Whitman', 'Edgar Allan Poe'];
    const randomPoet = poets[Math.floor(Math.random() * poets.length)];
    
    const response = await fetch(
      `https://poetrydb.org/author/${encodeURIComponent(randomPoet)}/lines`
    );
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      // Get poems that are reasonably short (under 200 chars)
      const apiPoetry: WisdomItem[] = data
        .filter((poem: any) => {
          const text = Array.isArray(poem.lines) ? poem.lines.join('\n') : '';
          return text.length > 0 && text.length < 300;
        })
        .slice(0, 10)
        .map((poem: any, index: number) => ({
          id: `poetry:api-${randomPoet.toLowerCase().replace(/\s+/g, '-')}-${index}`,
          source: 'poetry' as WisdomSource,
          title: poem.title,
          text: Array.isArray(poem.lines) ? poem.lines.join('\n') : poem.lines,
          attribution: poem.author,
          ref: undefined
        }));

      if (apiPoetry.length > 0) {
        // Combine with local poetry
        const combined = [...poetryData as WisdomItem[], ...apiPoetry];
        setCachedData('poetry', combined);
        return combined;
      }
    }
    
    throw new Error('Invalid API response');
  } catch (error) {
    console.warn('Poetry API failed, using offline data:', error);
    return poetryData as WisdomItem[];
  }
}

export const providers: Record<WisdomSource, Provider> = {
  koan: fromStatic(koansData as WisdomItem[]),
  stoic: fetchStoicQuotes,
  poetry: fetchPoetry,
  bible: fetchBibleVerses,
};
