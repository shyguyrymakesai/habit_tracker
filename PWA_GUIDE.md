# PWA Setup Guide

## Overview
This app is now a Progressive Web App (PWA) that can be installed on devices and works offline.

## Features

### ✅ Installable
- Users can install the app on their home screen (mobile/desktop)
- Works like a native app when installed
- Custom app icons included

### ✅ Offline Support
- Core screens work without internet connection
- Service Worker caches essential assets
- Auto-updates when new versions are deployed

### ✅ Manifest Configuration
- **App Name**: Habit Tracker
- **Short Name**: Habits
- **Theme Color**: #111827 (dark gray)
- **Background**: #ffffff (white)
- **Display Mode**: standalone (no browser UI)
- **Start URL**: /#/

## Icon Files

### Generated Placeholders
Located in `/public/`:
- `pwa-192.png` - 192x192px standard icon
- `pwa-512.png` - 512x512px high-res icon
- `pwa-maskable.png` - 512x512px maskable icon (with safe zone padding)

### Replacing Icons
To customize the app icons:
1. Create your designs (recommended: 512x512px minimum)
2. Replace the PNG files in `/public/`
3. Rebuild: `npm run build`

Or regenerate placeholders:
```bash
node generate-icons.cjs
```

## Testing

### Local Testing
```bash
# Build production version
npm run build

# Preview with service worker
npm run preview
```

Then open http://localhost:4173/

### Install Prompt
1. Open in Chrome/Edge
2. Look for install icon in address bar
3. Click to install
4. App opens in standalone window

### Offline Testing
1. Install the app
2. Open DevTools → Network tab
3. Check "Offline" checkbox
4. Navigate the app - core features still work!

## Deployment

### GitHub Pages
The app is configured for GitHub Pages deployment:
- Base path: `./` (relative)
- Hash routing enabled
- Service worker registered at root

After pushing to GitHub:
1. GitHub Actions builds the app
2. Service worker is included in deployment
3. Users get install prompt automatically
4. Auto-updates on next visit after deployment

## Browser Support

### Full PWA Support
- Chrome/Edge (desktop & mobile)
- Safari (iOS 16.4+, macOS)
- Firefox (desktop & Android)

### Install Prompt
- Chrome/Edge: ✅ Full support
- Safari: ✅ Add to Home Screen
- Firefox: ✅ Desktop install

## Troubleshooting

### Install Prompt Not Showing
- Ensure you're using HTTPS (or localhost)
- Check DevTools → Application → Manifest
- Verify service worker is registered

### Offline Not Working
- Check DevTools → Application → Service Workers
- Ensure SW is activated
- Clear cache and reload if issues persist

### Icons Not Displaying
- Verify PNG files exist in `/public/`
- Check manifest in DevTools → Application → Manifest
- Ensure correct sizes (192x192, 512x512)

## Technical Details

### Service Worker Strategy
- **Precache**: All static assets cached on install
- **Runtime Cache**: Google Fonts cached for 1 year
- **Update Strategy**: Auto-update on page reload

### Workbox Configuration
- Glob patterns: `**/*.{js,css,html,ico,png,svg,json,txt}`
- Navigation preload enabled
- Clean old caches automatically

## Development

### Disable PWA (Development)
The service worker only registers in production builds. In dev mode (`npm run dev`), no SW is active.

### Force Update
To force service worker update:
1. DevTools → Application → Service Workers
2. Check "Update on reload"
3. Refresh the page

## Resources
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
