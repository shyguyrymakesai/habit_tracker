# Capacitor Mobile Development Guide

## Overview
Your Habit Tracker PWA is now wrapped with Capacitor, enabling native Android and iOS builds without rewriting the app.

---

## Quick Start

### Build for Mobile
```bash
npm run build:mobile
```

### Open Native IDEs
```bash
npm run open:android    # Android Studio
npm run open:ios        # Xcode (macOS only)
```

---

## Project Structure

```
habit_tracker/
├── src/                      # React app source code
├── dist/                     # Built web app
├── capacitor.config.ts       # Capacitor configuration
├── android/                  # Android native project (gitignored)
├── ios/                      # iOS native project (gitignored)
└── package.json              # NPM scripts
```

---

## Configuration

### App Identity
- **App Name:** Echo Habits
- **Bundle ID:** com.echoleague.habits
- **Web Directory:** dist

### capacitor.config.ts
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echoleague.habits',
  appName: 'Echo Habits',
  webDir: 'dist',
  server: {
    androidScheme: 'https'  // Enables PWA features on Android
  }
};

export default config;
```

### Why androidScheme: 'https'?
- Enables service workers on Android
- Required for PWA offline functionality
- Allows secure context APIs (camera, geolocation)
- Matches web behavior

---

## Development Workflow

### 1. Web Development (Primary)
```bash
# Start dev server
npm run dev

# Test in browser
# Visit: http://localhost:5173/

# Make changes in src/
# Changes hot-reload automatically
```

### 2. Build for Mobile
```bash
# Build web app and copy to native platforms
npm run build:mobile
```

This command:
1. Compiles TypeScript
2. Bundles with Vite
3. Generates PWA service worker
4. Copies built files to `android/app/src/main/assets/public/`
5. Copies built files to `ios/App/App/public/`

### 3. Test on Native Platform

#### Android
```bash
# Open in Android Studio
npm run open:android

# Then in Android Studio:
# 1. Wait for Gradle sync
# 2. Select device/emulator
# 3. Click Run (▶️)
```

#### iOS (macOS only)
```bash
# Open in Xcode
npm run open:ios

# Then in Xcode:
# 1. Select target device/simulator
# 2. Click Run (▶️) or Cmd+R
```

### 4. After Making Changes

**Web-only changes (HTML/CSS/JS):**
```bash
npm run build:mobile
```

**Native changes (plugins, config):**
```bash
npx cap sync
```

---

## Platform Setup

### Android Development

#### Prerequisites
1. **Node.js** ✅ (already installed)
2. **Android Studio** (download from https://developer.android.com/studio)
3. **Java JDK 17+** (bundled with Android Studio)

#### First-Time Setup
1. Install Android Studio
2. Open Android Studio → More Actions → SDK Manager
3. Install:
   - Android SDK Platform 33+
   - Android SDK Build-Tools
   - Android Emulator
4. Create virtual device (AVD) for testing

#### Building APK
```bash
# Build for testing
npm run build:mobile
npm run open:android

# In Android Studio:
Build → Build Bundle(s) / APK(s) → Build APK(s)

# APK location:
android/app/build/outputs/apk/debug/app-debug.apk
```

#### Building for Release
```bash
# In Android Studio:
Build → Generate Signed Bundle / APK
# Follow wizard to create keystore and sign
```

---

### iOS Development

#### Prerequisites
1. **macOS** (required)
2. **Xcode 14+** (download from App Store)
3. **CocoaPods** (install with: `sudo gem install cocoapods`)

#### First-Time Setup
```bash
# Install CocoaPods dependencies
cd ios/App
pod install
cd ../..
```

#### Building
```bash
npm run build:mobile
npm run open:ios

# In Xcode:
# 1. Select target: Echo Habits
# 2. Select device/simulator
# 3. Product → Run (or ⌘R)
```

#### Building for Release
```bash
# In Xcode:
# 1. Product → Archive
# 2. Distribute App
# 3. Upload to App Store Connect
```

---

## NPM Scripts Reference

### Build Commands
| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server |
| `build` | `tsc && vite build` | Build web app |
| `build:mobile` | `npm run build && npx cap copy` | Build and copy to platforms |
| `preview` | `vite preview` | Preview production build |

### Platform Commands
| Script | Command | Description |
|--------|---------|-------------|
| `open:android` | `npx cap open android` | Open Android Studio |
| `open:ios` | `npx cap open ios` | Open Xcode |

### Capacitor CLI Commands
```bash
# Sync web code to platforms
npx cap copy

# Sync and update dependencies
npx cap sync

# Update Capacitor
npx cap update

# Add new platform
npx cap add android
npx cap add ios
```

---

## Adding Capacitor Plugins

### Example: Add Camera Plugin
```bash
# Install plugin
npm install @capacitor/camera

# Sync to platforms
npx cap sync
```

### Use in Code
```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  
  const imageUrl = image.webPath;
  // Use imageUrl...
};
```

### Popular Plugins
- `@capacitor/camera` - Camera and photos
- `@capacitor/geolocation` - GPS location
- `@capacitor/push-notifications` - Push notifications
- `@capacitor/local-notifications` - Local notifications
- `@capacitor/share` - Native share dialog
- `@capacitor/storage` - Native storage
- `@capacitor/haptics` - Device vibration

Full list: https://capacitorjs.com/docs/plugins

---

## Customizing App

### App Icons

#### Android
1. Create icon sizes:
   - mdpi: 48x48
   - hdpi: 72x72
   - xhdpi: 96x96
   - xxhdpi: 144x144
   - xxxhdpi: 192x192

2. Place in:
   ```
   android/app/src/main/res/
   ├── mipmap-mdpi/ic_launcher.png
   ├── mipmap-hdpi/ic_launcher.png
   ├── mipmap-xhdpi/ic_launcher.png
   ├── mipmap-xxhdpi/ic_launcher.png
   └── mipmap-xxxhdpi/ic_launcher.png
   ```

#### iOS
1. Open Xcode
2. Select `Assets.xcassets` → `AppIcon`
3. Drag and drop icon sizes
4. Required sizes:
   - 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024

### Splash Screen

#### Android
Edit: `android/app/src/main/res/drawable/splash.png`

#### iOS
1. Open Xcode
2. Select `Assets.xcassets` → `Splash`
3. Add splash images

### App Name
Change in `capacitor.config.ts`:
```typescript
appName: 'Your App Name'
```

Then run:
```bash
npx cap sync
```

---

## Debugging

### Web Debugging (Chrome DevTools)
```bash
npm run dev
# Open http://localhost:5173/
# F12 for DevTools
```

### Android Debugging
```bash
# Run app in Android Studio
# Then open Chrome:
chrome://inspect

# Click "inspect" on your app
# Full DevTools available!
```

### iOS Debugging (Safari)
```bash
# Run app in Xcode
# Then in Safari:
# Develop → Simulator/Device → Echo Habits

# Full Web Inspector available!
```

---

## Troubleshooting

### Issue: Android build fails
**Check:**
- Android Studio installed?
- JDK 17+ installed?
- Gradle sync completed?

**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run build:mobile
```

### Issue: iOS build fails (CocoaPods)
**Solution:**
```bash
cd ios/App
pod deintegrate
pod install
cd ../..
npm run build:mobile
```

### Issue: Web changes not showing in app
**Solution:**
```bash
npm run build:mobile
# Rebuild and rerun in IDE
```

### Issue: Service worker not working on Android
**Check:** `androidScheme: 'https'` in capacitor.config.ts
**Solution:** Already configured ✅

### Issue: App crashes on launch
**Check:**
1. Web build successful?
2. Console errors in native IDE?
3. Service worker compatibility?

**Solution:**
```bash
# Rebuild everything
npm run build:mobile
# Check native IDE console for errors
```

---

## Release Checklist

### Before Release
- [ ] Test on real Android device
- [ ] Test on real iOS device
- [ ] Test offline functionality
- [ ] Update app version in package.json
- [ ] Update version in android/app/build.gradle
- [ ] Update version in ios/App/App/Info.plist
- [ ] Create proper app icons
- [ ] Create splash screens
- [ ] Test all core features
- [ ] Fix any crashes or bugs

### Android Release
- [ ] Generate signed APK/AAB
- [ ] Test signed build
- [ ] Upload to Google Play Console
- [ ] Fill out store listing
- [ ] Submit for review

### iOS Release
- [ ] Archive in Xcode
- [ ] Upload to App Store Connect
- [ ] Fill out App Store listing
- [ ] Submit for review

---

## Performance Tips

### Optimize Build Size
```bash
# Analyze bundle
npm run build -- --analyze

# Use dynamic imports for large features
const Feature = React.lazy(() => import('./Feature'));
```

### Optimize Images
- Use WebP format
- Compress with tools like ImageOptim
- Use responsive images

### Optimize Service Worker
- Cache only essential assets
- Set appropriate cache expiration
- Use runtime caching strategically

---

## Resources

### Documentation
- Capacitor Docs: https://capacitorjs.com/docs
- Android Docs: https://developer.android.com
- iOS Docs: https://developer.apple.com

### Community
- Capacitor Discord: https://discord.gg/capacitor
- Ionic Forum: https://forum.ionicframework.com

### Tools
- Android Studio: https://developer.android.com/studio
- Xcode: https://developer.apple.com/xcode
- Capacitor CLI: https://capacitorjs.com/docs/cli

---

## Summary

✅ **PWA → Native App** without rewriting  
✅ **Shared codebase** for web, Android, iOS  
✅ **Native features** via Capacitor plugins  
✅ **Easy updates** - just rebuild web app  

**Next Steps:**
1. Install Android Studio
2. Run `npm run open:android`
3. Build and test on emulator
4. Deploy to app stores!

---

**App:** Echo Habits  
**Bundle ID:** com.echoleague.habits  
**Status:** Ready for native development! 🚀📱
