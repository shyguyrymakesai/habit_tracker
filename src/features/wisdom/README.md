# Wisdom Module

## Overview

Th### Data Storage

All data is stored in localStorage:

- `wisdom/settings/v1`: User preferences (enabled sources, bible translation)
- `wisdom/weeklog/v1`: Current week's shown items (isoWeekKey + items array)
- `wisdom/api-cache/v1/{source}`: Cached API responses (24-hour TTL)

### API Providers

The wisdom module uses free, public APIs to enhance content with optional fallback to offline data:

#### Bible Verses
- **API**: [bible-api.com](https://bible-api.com/)
- **Features**: World English Bible (WEB) translation, no authentication required
- **Fallback**: 10 hardcoded verses from Psalms, Proverbs, Philippians, etc.
- **Cache**: 24 hours

#### Stoic Quotes
- **API**: [stoic-quotes.com](https://stoic-quotes.com/api/quotes)
- **Features**: Quotes from Marcus Aurelius, Epictetus, Seneca, and others
- **Fallback**: 10 curated stoic quotes
- **Cache**: 24 hours

#### Poetry
- **API**: [PoetryDB](https://poetrydb.org/)
- **Features**: Random poems from Emily Dickinson, Robert Frost, Walt Whitman, Edgar Allan Poe
- **Fallback**: 10 haiku and short poems from Rumi, Bashō, Hafiz, etc.
- **Cache**: 24 hours

#### Koans
- **Source**: Static JSON (20 classic Zen koans)
- **No API**: Koans are curated and served from local data only

### Offline Support

All sources work completely offline:
- If APIs fail, the app automatically falls back to local data
- Previously cached API responses are used when offline
- No degradation in functionality without internet connection

### Dataset Attribution

- **Koans**: Classic Zen texts from The Gateless Gate (無門関 Mumonkan) and 101 Zen Stories, curated based on the [koanr](https://github.com/malcolmbarrett/koanr) package structure (MIT License, © 2018 Malcolm Barrett). Includes famous koans like Joshu's Dog ("Mu"), Wash Your Bowl, Not the Wind Not the Flag, and more.
- **Stoic Quotes**: Marcus Aurelius, Epictetus, Seneca (public domain)
- **Poetry**: Rumi, Bashō, Ryōkan, Hafiz, Whitman, Dickinson (public domain)
- **Bible**: World English Bible translation (public domain)om module provides daily rotating quotes from multiple sources (Koans, Stoic quotes, Poetry, and Bible verses) on the Home page. It ensures no repeats within the same week and features a special Sunday display showing all koans from that week.

Koans are sourced from classic Zen Buddhist texts including The Gateless Gate (Mumonkan) and 101 Zen Stories, inspired by the [koanr R package](https://github.com/malcolmbarrett/koanr) by Malcolm Barrett (MIT License).

## Features

- **Daily Wisdom**: A new quote each day from enabled sources
- **No Weekly Repeats**: Tracks shown items per ISO week to avoid repetition
- **Sunday Koan List**: Displays all koans shown during the week on Sundays
- **Offline-First with API Enhancement**: Works entirely offline using local JSON datasets, with optional API enrichment
- **Configurable Sources**: Users can enable/disable specific sources in Settings
- **Timezone Aware**: Uses America/Indiana/Indianapolis timezone for date calculations
- **Smart Caching**: API responses cached for 24 hours to minimize requests and work offline

## File Structure

```
src/features/wisdom/
├── types.ts                  # TypeScript interfaces
├── providers.ts              # Data providers for each source
├── wisdom.ts                 # Core service (getDailyWisdom, settings, week log)
├── useDailyWisdom.ts         # React hook
├── WisdomCard.tsx            # Display components
├── WisdomCard.css            # Component styles
├── WisdomSettings.tsx        # Settings panel
├── WisdomSettings.css        # Settings styles
└── data/
    ├── koans.json            # Zen koans dataset
    ├── stoic.json            # Stoic quotes dataset
    ├── poetry.json           # Poetry dataset
    └── (bible verses are in providers.ts)
```

## Data Storage

All data is stored in localStorage:

- `wisdom/settings/v1`: User preferences (enabled sources, bible translation)
- `wisdom/weeklog/v1`: Current week's shown items (isoWeekKey + items array)

## Usage

### On Home Page

The wisdom card appears automatically below the date header:

```tsx
import { useDailyWisdom } from '../features/wisdom/useDailyWisdom';
import { WisdomCard, WeeklyKoansList } from '../features/wisdom/WisdomCard';

const { today, weeklyKoans, loading } = useDailyWisdom();

{!loading && today && <WisdomCard item={today} />}
{!loading && weeklyKoans.length > 0 && <WeeklyKoansList items={weeklyKoans} />}
```

### In Settings

Users can toggle sources on/off:

```tsx
import { WisdomSettingsPanel } from '../features/wisdom/WisdomSettings';

<WisdomSettingsPanel />
```

## How It Works

1. **Daily Selection**: Uses current date as seed for deterministic selection
2. **Week Tracking**: Calculates ISO week key (e.g., "2025-W40")
3. **No Repeats**: Filters out items already shown this week
4. **Sunday Special**: On Sundays, displays all koans from the week
5. **Week Reset**: When new week starts, resets the log and starts fresh

## Adding New Content

### Add New Koans

Edit `src/features/wisdom/data/koans.json`:

```json
{
  "id": "koan:unique-id",
  "source": "koan",
  "title": "Title of Koan",
  "text": "The full text...",
  "ref": "Source reference",
  "attribution": "Author"
}
```

### Add New Stoic Quotes

Edit `src/features/wisdom/data/stoic.json` with similar structure.

### Add New Poetry

Edit `src/features/wisdom/data/poetry.json` with similar structure.

### Add Bible Verses

Edit the `bibleVerses` array in `src/features/wisdom/providers.ts`.

## Future Enhancements

- **More API Sources**: Additional poetry APIs, Tao Te Ching, Buddhist texts
- **Share Feature**: Copy to clipboard or export as image
- **Reflection Notes**: Add journaling feature tied to daily wisdom
- **Weighted Selection**: Allow users to prefer certain sources
- **Custom Collections**: Let users create custom quote collections
- **API Configuration**: Allow users to bring their own API keys for premium services
- **Translation Options**: Multiple Bible translations (KJV, ESV, NIV, etc.)

