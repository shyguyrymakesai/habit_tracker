# 📊 Habit Tracker

A comprehensive personal habit tracking application built with React, TypeScript, and Vite. Track your daily habits, medications, custom ratings, and gain insights from your data with beautiful visualizations.

🌐 **Live Demo**: [https://shyguyrymakesai.github.io/habit_tracker](https://shyguyrymakesai.github.io/habit_tracker)

## 📱 PWA Usage

### Install as App
This is a **Progressive Web App (PWA)** that can be installed on your device:

**Desktop (Chrome/Edge):**
1. Visit the live demo
2. Look for the install icon (⊕) in the address bar
3. Click "Install Habit Tracker"
4. App opens in its own window like a native app

**Mobile (iOS/Android):**
1. Visit the live demo
2. Tap the browser menu (⋮ or share icon)
3. Select "Add to Home Screen" or "Install app"
4. App icon appears on your home screen
5. Opens fullscreen without browser UI

### Offline Support
Once installed, the app **works completely offline**:
- ✅ All pages load without internet
- ✅ Track habits, medications, and ratings offline
- ✅ View your history and trends
- ✅ Daily wisdom shows cached quotes
- ✅ Auto-syncs when back online

**Test Offline:**
1. Install the app
2. Turn off Wi-Fi/mobile data
3. Open the app - everything still works!
4. Turn network back on - fresh wisdom quotes load

### Hash Routing
The app uses hash-based routing for compatibility with static hosting:
- Home: `/#/`
- Demo: `/#/demo`
- Habits: `/#/habits`
- Trends: `/#/trends`
- All routes work offline!

## ✨ Features

### 🎯 **Daily Tracking**
- **Habits**: Track completion-based and time-based habits
  - Boolean habits (completed/not completed)
  - Time-based habits with minute tracking
  - Weekly goal setting for time-based activities
  - Custom emojis and icons
  - Mark all complete / Clear all functionality
  
- **Medications**: Manage and track your medication adherence
  - Morning, night, or both timing options
  - Dose tracking with customizable units (mg, g, µg)
  - Active/inactive status management
  
- **Custom Ratings**: Create personalized metrics to rate daily
  - Configurable min/max scales
  - Custom icons and names
  - Track mood, energy, productivity, or anything you want
  
- **Sleep Tracking**: Log hours of sleep each night
  
- **Notes**: Add daily notes and reflections

### 💫 **Daily Wisdom**
- Curated daily quotes from four sources:
  - 📜 **Zen Koans** - 20 classic koans from traditional collections
  - ✝️ **Bible Verses** - Random verses from the King James Version
  - 🏛️ **Stoic Quotes** - Wisdom from ancient Stoic philosophers
  - 🧘 **Poetry** - Haiku and contemplative poetry
- **Refresh Button**: Get new random quotes on demand
- **Save Quotes**: Build your personal collection of favorite wisdom
- **Dedicated Quotes Page**: View and manage all your saved quotes
- **Smart Caching**: 24-hour API cache for optimal performance
- **Offline-First**: Works without internet using local quote libraries
- **No Repeats**: Wisdom rotates throughout the week without duplicates

### 📈 **Analytics & Insights**
- **Trends Page**: Visualize your progress over time
  - Line charts for custom ratings (past 7/30/365 days)
  - Stacked area charts for time-based habit tracking
  - Multi-metric comparison
  - Color-coded visualization
  
- **History Page**: Complete entry archive
  - Search across all entries
  - Filter by time range (week/month/year/all)
  - Edit or delete past entries
  - Detailed summaries of habits, medications, and ratings

### ⚙️ **Settings & Data Management**
- Configure enabled wisdom sources
- Export data to CSV or JSON
- Import data from backups
- Clear all data option
- Theme preferences (coming soon)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shyguyrymakesai/habit_tracker.git
cd habit_tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to GitHub Pages

```bash
npm run deploy
```

Or push to the `main` branch and GitHub Actions will automatically build and deploy.

### Preview Production Build

```bash
npm run preview
```

## 🏗️ Project Structure

```
habit_tracker/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── EntryForm.tsx    # Daily entry form
│   │   ├── HabitList.tsx    # Habit tracking component
│   │   ├── MedicationList.tsx
│   │   ├── RatingList.tsx
│   │   ├── TrendChart.tsx   # Line chart for ratings
│   │   ├── HabitStackedAreaChart.tsx
│   │   └── Navbar.tsx       # Navigation bar
│   ├── pages/               # Page components (routing)
│   │   ├── Home.tsx         # Daily entry page
│   │   ├── HabitSettings.tsx
│   │   ├── MedicationSettings.tsx
│   │   ├── RatingSettings.tsx
│   │   ├── Quotes.tsx       # Saved wisdom collection
│   │   ├── Trends.tsx       # Analytics dashboard
│   │   ├── History.tsx      # Entry archive
│   │   └── Settings.tsx     # App settings
│   ├── features/            # Feature modules
│   │   └── wisdom/          # Daily wisdom module
│   │       ├── types.ts
│   │       ├── providers.ts  # Data sources & API integration
│   │       ├── wisdom.ts     # Core logic
│   │       ├── savedWisdom.ts
│   │       ├── useDailyWisdom.ts
│   │       ├── WisdomCard.tsx
│   │       ├── WisdomSettings.tsx
│   │       ├── SavedWisdomPanel.tsx
│   │       ├── WeeklyKoansList.tsx
│   │       ├── data/         # Offline quote libraries
│   │       │   ├── koans.json
│   │       │   ├── stoic.json
│   │       │   └── poetry.json
│   │       ├── API_INTEGRATION.md
│   │       └── README.md
│   ├── lib/                 # Core utilities
│   │   ├── db.ts            # IndexedDB wrapper
│   │   ├── schemas.ts       # Zod validation schemas
│   │   ├── habits.ts        # Habit CRUD operations
│   │   ├── medications.ts   # Medication CRUD
│   │   ├── ratings.ts       # Rating CRUD
│   │   ├── stats.ts         # Statistics calculations
│   │   ├── export.ts        # Data export (CSV/JSON)
│   │   └── seed.ts          # Demo data generation
│   ├── main.tsx             # App entry point & routing
│   ├── index.css            # Global styles
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3
- **Language**: TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Data Validation**: Zod
- **Local Storage**: LocalForage (IndexedDB wrapper)
- **Charts**: Recharts 2.12
- **Styling**: CSS (custom properties for theming)
- **UUID Generation**: uuid
- **APIs**: 
  - bible-api.com (King James Version)
  - stoic-quotes.com
  - poetrydb.org

## 📱 Pages & Navigation

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Daily entry form with wisdom cards |
| Habits | `/habits` | Manage habit definitions |
| Medications | `/medications` | Manage medication list |
| Ratings | `/ratings` | Manage custom rating metrics |
| Quotes | `/quotes` | View saved wisdom collection |
| Trends | `/trends` | Analytics dashboard with charts |
| History | `/history` | Browse and search past entries |
| Settings | `/settings` | App configuration |

## 💾 Data Storage

All data is stored locally in your browser using **IndexedDB** via LocalForage:
- No server required
- No user accounts
- Complete privacy - your data never leaves your device
- Persists across sessions
- Export/import capabilities for backup

### Storage Structure
- `habits` - Habit definitions
- `medications` - Medication definitions
- `ratings` - Custom rating definitions
- `entries` - Daily log entries
- `wisdom` - Wisdom settings, cache, saved quotes, week log

## 🎨 Customization

### Adding Custom Habits
1. Go to **Habits** page
2. Click "Add Habit"
3. Choose name, icon, and type (boolean or time-based)
4. Set weekly goals for time-based habits

### Creating Custom Ratings
1. Go to **Ratings** page
2. Click "Add Rating"
3. Define name, scale (min/max), and icon
4. Track anything: mood, energy, stress, focus, etc.

### Configuring Wisdom Sources
1. Go to **Settings** page
2. Toggle wisdom sources on/off
3. Choose which types of quotes you want to see

## 📊 Analytics

The **Trends** page provides:
- Line charts tracking your custom ratings over time
- Stacked area charts showing time-based habit minutes
- Configurable time ranges: 7 days, 30 days, or 365 days
- Multi-color visualization for easy comparison

## 🔄 Data Export/Import

### Export Options
- **CSV**: Spreadsheet-compatible format for analysis
- **JSON**: Complete backup of all data

### Export Process
1. Go to Settings
2. Click "Export Data"
3. Choose format
4. File downloads automatically

### Import Process
1. Go to Settings
2. Click "Import Data"
3. Select your backup file
4. Confirm to restore data

## 🌐 API Integration

The wisdom module integrates with three free public APIs:
- **Bible API** (`bible-api.com`) - Random KJV verses
- **Stoic Quotes API** (`stoic-quotes.com`) - Daily Stoic wisdom
- **PoetryDB** (`poetrydb.org`) - Haiku and poetry

All APIs include:
- 24-hour client-side caching
- Graceful fallback to offline data
- No authentication required
- Rate limit friendly

See `src/features/wisdom/API_INTEGRATION.md` for details.

## 🐛 Troubleshooting

### Data Not Saving
- Check browser console for errors
- Ensure cookies/local storage are enabled
- Try a different browser

### Charts Not Displaying
- Ensure you have entries with the metrics you're viewing
- Check that date range includes your data
- Refresh the page

### Wisdom Not Loading
- Check internet connection for API-enhanced quotes
- Offline quotes always available
- Clear browser cache if issues persist

## 🤝 Contributing

This is a personal project, but suggestions and bug reports are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Zen Koans**: Inspired by the `koanr` package and traditional collections (The Gateless Gate, 101 Zen Stories)
- **Bible Verses**: Powered by bible-api.com
- **Stoic Quotes**: Powered by stoic-quotes.com
- **Poetry**: Powered by PoetryDB

## 📧 Contact

- **GitHub**: [@shyguyrymakesai](https://github.com/shyguyrymakesai)
- **Repository**: [habit_tracker](https://github.com/shyguyrymakesai/habit_tracker)

---

**Built with ❤️ for personal growth and self-improvement** 🌱
