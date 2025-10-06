# CT-03 Quick Reference - Capacitor Mobile Wrapper

## ✅ Task Complete

### What Was Done
1. ✅ Installed Capacitor packages (@capacitor/core, @capacitor/cli, @capacitor/android, @capacitor/ios)
2. ✅ Initialized Capacitor with app name "Echo Habits" and ID "com.echoleague.habits"
3. ✅ Configured capacitor.config.ts with androidScheme: 'https'
4. ✅ Added NPM scripts: build:mobile, open:android, open:ios
5. ✅ Added Android platform (android/ folder created)
6. ✅ Added iOS platform (ios/ folder created)

---

## NPM Scripts

```bash
# Build web app and copy to mobile platforms
npm run build:mobile

# Open Android project in Android Studio
npm run open:android

# Open iOS project in Xcode (macOS only)
npm run open:ios
```

---

## Configuration

### capacitor.config.ts
```typescript
{
  appId: 'com.echoleague.habits',
  appName: 'Echo Habits',
  webDir: 'dist',
  server: {
    androidScheme: 'https'  // Required for PWA features
  }
}
```

---

## Folder Structure

```
habit_tracker/
├── android/              # Android native project ✅
├── ios/                  # iOS native project ✅
├── capacitor.config.ts   # Capacitor config ✅
└── package.json          # Updated with scripts ✅
```

---

## Acceptance Criteria

### ✅ npm run build:mobile completes
```bash
$ npm run build:mobile
✓ built in 3.38s
√ copy web in 16.54ms
```

### ✅ npx cap add android / ios succeeds
```bash
$ npx cap add android
[success] android platform added!

$ npx cap add ios
[success] ios platform added!
```

**Platform folders:** ✅ Created

---

## Quick Commands

### Build & Sync
```bash
npm run build:mobile
```

### Manual Sync
```bash
npm run build
npx cap copy
```

### Open Platforms
```bash
npm run open:android    # Android Studio
npm run open:ios        # Xcode (macOS)
```

---

## Development Workflow

1. **Make changes to web app**
   ```bash
   # Edit files in src/
   ```

2. **Build for mobile**
   ```bash
   npm run build:mobile
   ```

3. **Open native IDE**
   ```bash
   npm run open:android  # or open:ios
   ```

4. **Build and run from IDE**
   - Android Studio: Run button
   - Xcode: Product → Run

---

## Platform Requirements

### Android
- Node.js ✅
- Android Studio (need to install)
- Java JDK 17+

### iOS
- macOS required
- Xcode 14+
- CocoaPods

---

## Next Steps

1. **Install Android Studio** (for Android builds)
2. **Test on emulator/device**
3. **Configure app icons and splash screens**
4. **Set up signing for release builds**

---

## Troubleshooting

### Web changes not showing
```bash
npm run build:mobile
```

### Platform not found error
```bash
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios
```

---

**Status:** ✅ COMPLETE  
**App Name:** Echo Habits  
**Bundle ID:** com.echoleague.habits  
**Platforms:** Android ✅ | iOS ✅
