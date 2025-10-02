# API Integration Guide

## Overview

The Wisdom module now fetches content from free public APIs to provide fresh, diverse content daily while maintaining full offline functionality.

## APIs Used

### 1. Bible API (bible-api.com)
```
Endpoint: https://bible-api.com/{verse}?translation=web
Auth: None required
Rate Limit: Reasonable use
Example: https://bible-api.com/John%203:16?translation=web
```

**Response Format:**
```json
{
  "reference": "John 3:16",
  "text": "For God so loved the world...",
  "translation_name": "World English Bible"
}
```

### 2. Stoic Quotes API (stoic-quotes.com)
```
Endpoint: https://stoic-quotes.com/api/quotes
Auth: None required
Rate Limit: Unknown (cached for 24h)
```

**Response Format:**
```json
[
  {
    "text": "You have power over your mind...",
    "author": "Marcus Aurelius",
    "source": "Meditations"
  }
]
```

### 3. PoetryDB (poetrydb.org)
```
Endpoint: https://poetrydb.org/author/{poet}/lines
Auth: None required
Rate Limit: Reasonable use
Example: https://poetrydb.org/author/Emily%20Dickinson/lines
```

**Response Format:**
```json
[
  {
    "title": "Hope is the thing with feathers",
    "author": "Emily Dickinson",
    "lines": ["Hope is the thing...", "That perches..."]
  }
]
```

## Caching Strategy

### Cache Structure
```typescript
interface CachedData {
  timestamp: number;      // Unix timestamp when cached
  items: WisdomItem[];    // Array of fetched items
}
```

### Cache Keys
- `wisdom/api-cache/v1/bible` - Bible verses
- `wisdom/api-cache/v1/stoic` - Stoic quotes  
- `wisdom/api-cache/v1/poetry` - Poetry

### Cache Behavior
1. **First Load**: Fetches from API, stores in cache
2. **Within 24h**: Returns cached data (no API call)
3. **After 24h**: Re-fetches from API, updates cache
4. **API Failure**: Falls back to offline data
5. **Offline**: Uses cached data if available, else offline data

## Error Handling

All API calls are wrapped in try-catch with automatic fallback:

```typescript
try {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('API request failed');
  
  const data = await response.json();
  // Process and cache data
  return apiData;
} catch (error) {
  console.warn('API failed, using offline data:', error);
  return offlineData;
}
```

## Benefits

✅ **Offline-First**: Works without internet
✅ **Fresh Content**: New quotes from APIs daily
✅ **Performance**: 24h cache reduces API calls
✅ **Resilient**: Graceful degradation on API failure
✅ **No API Keys**: All APIs are free and public
✅ **CORS-Friendly**: All APIs support browser requests

## Testing

### Test Online Mode
1. Clear cache: `localStorage.removeItem('wisdom/api-cache/v1/bible')`
2. Reload page - should fetch from API
3. Check console for success messages
4. Verify cache is populated

### Test Offline Mode
1. Open DevTools → Network → Enable "Offline"
2. Clear cache (optional)
3. Reload page - should use offline data
4. No errors should appear

### Test Cache
1. Load page (fetches from API)
2. Reload within 24h - should use cache (no network request)
3. After 24h - should re-fetch from API

## Monitoring

Check console for these messages:
- `Bible API failed, using offline data` - API unreachable
- `Stoic API failed, using offline data` - API unreachable  
- `Poetry API failed, using offline data` - API unreachable
- `Failed to cache {source} data` - localStorage full/unavailable

## Future Improvements

- [ ] Add retry logic with exponential backoff
- [ ] Implement request deduplication
- [ ] Add API health monitoring
- [ ] Support custom API endpoints via settings
- [ ] Implement quote favoriting/bookmarking
- [ ] Add "refresh" button to manually fetch new content
