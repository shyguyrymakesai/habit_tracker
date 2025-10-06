# PWA Testing Checklist - CT-01

## ✅ Acceptance Criteria Testing

### Test 1: Build & Preview ✅
**Command:**
```bash
npm run build && npm run preview
```

**Expected Results:**
- ✅ Build completes successfully
- ✅ Files generated:
  - `dist/sw.js` (service worker)
  - `dist/manifest.webmanifest` (PWA manifest)
  - `dist/pwa-*.png` (icons)
- ✅ Preview server starts at http://localhost:4173/

**Status:** PASSED ✅

---

### Test 2: Install Prompt (Desktop)
**Steps:**
1. Open http://localhost:4173/ in Chrome/Edge
2. Look at address bar for install icon (⊕)
3. Click the install button
4. Confirm installation

**Expected Results:**
- ✅ Install icon appears in address bar
- ✅ "Install Habit Tracker?" prompt shows
- ✅ App installs and opens in standalone window
- ✅ App icon visible in OS app list

**Status:** READY TO TEST 🧪

---

### Test 3: Install Prompt (Mobile)
**Steps:**
1. Visit deployed site on mobile device
2. Tap browser menu (⋮)
3. Look for "Add to Home Screen" or "Install app"
4. Tap to install

**Expected Results:**
- ✅ Install option available in menu
- ✅ Custom icon shown in prompt
- ✅ App name "Habit Tracker" displayed
- ✅ After install, app icon on home screen
- ✅ Opens in fullscreen (no browser UI)

**Status:** READY TO TEST 🧪  
**Note:** Requires HTTPS (GitHub Pages deployment)

---

### Test 4: Offline Functionality
**Steps:**
1. Install the app (desktop or mobile)
2. Open DevTools (F12) → Network tab
3. Check "Offline" checkbox
4. Navigate to different screens:
   - Home (/)
   - Habits (/habits)
   - Medications (/medications)
   - Quotes (/quotes)
   - Settings (/settings)

**Expected Results:**
- ✅ All core screens load offline
- ✅ Navigation works (hash routing)
- ✅ Styles render correctly
- ✅ No broken images
- ✅ Service worker serves cached content

**Status:** READY TO TEST 🧪

---

### Test 5: Auto-Update
**Steps:**
1. Install the app
2. Make a code change (e.g., edit a label)
3. Run `npm run build`
4. Deploy to GitHub Pages
5. Refresh the installed app

**Expected Results:**
- ✅ Service worker detects new version
- ✅ New content loads automatically
- ✅ No manual uninstall/reinstall needed

**Status:** READY TO TEST 🧪  
**Note:** Test after deployment

---

## Local Testing Commands

### Full Test Sequence
```bash
# 1. Clean build
npm run build

# 2. Start preview
npm run preview

# 3. Open browser
# Visit: http://localhost:4173/

# 4. Check DevTools
# Application → Manifest (verify settings)
# Application → Service Workers (verify registered)
# Network → Offline mode (test offline)
```

### Verify Manifest
```bash
# Check manifest content
cat dist/manifest.webmanifest | python -m json.tool
```

Expected output:
```json
{
  "name": "Habit Tracker",
  "short_name": "Habits",
  "theme_color": "#111827",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/#/"
}
```

---

## Production Testing (GitHub Pages)

### After Deployment
1. Visit: https://shyguyrymakesai.github.io/habit_tracker/
2. Check for install prompt
3. Install the app
4. Test offline mode
5. Verify auto-update

### Browser DevTools Checks

**Chrome/Edge DevTools → Application:**
- ✅ Manifest: All fields populated correctly
- ✅ Service Workers: Active and running
- ✅ Cache Storage: Assets cached
- ✅ Offline: Works without network

**Lighthouse Audit:**
1. DevTools → Lighthouse
2. Select "Progressive Web App"
3. Run audit
4. Expected score: 90+ / 100

---

## Troubleshooting

### Install Prompt Not Showing
**Possible causes:**
- ❌ Not using HTTPS (required for PWA)
- ❌ Manifest missing or invalid
- ❌ Service worker not registered
- ❌ Icons missing or wrong size

**Solutions:**
```bash
# Check manifest exists
ls dist/manifest.webmanifest

# Check service worker
ls dist/sw.js

# Check icons
ls dist/pwa-*.png

# Rebuild if missing
npm run build
```

### Offline Not Working
**Check:**
1. Service worker registered?
   - DevTools → Application → Service Workers
2. Assets cached?
   - DevTools → Application → Cache Storage
3. Network truly offline?
   - DevTools → Network → Offline checkbox

### Icons Not Showing
**Verify:**
```bash
# Icons should be in public/
ls public/pwa-*.png

# And copied to dist/
ls dist/pwa-*.png
```

If missing:
```bash
# Regenerate icons
node generate-icons.cjs

# Rebuild
npm run build
```

---

## Success Criteria Summary

| Test | Status | Notes |
|------|--------|-------|
| Build & Preview | ✅ PASSED | All files generated |
| Install Prompt (Desktop) | 🧪 READY | Test in Chrome/Edge |
| Install Prompt (Mobile) | 🧪 READY | Test on deployed site |
| Offline Functionality | 🧪 READY | Test with DevTools |
| Auto-Update | 🧪 READY | Test after deployment |

---

**Overall Status:** ✅ IMPLEMENTATION COMPLETE  
**Next Action:** Test install prompt and offline functionality  
**Deployment:** Push to GitHub Pages triggers auto-deploy
