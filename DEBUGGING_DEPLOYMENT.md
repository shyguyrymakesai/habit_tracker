# 🔍 Debugging Deployment

## Current Configuration
- **Base Path**: `/demo/`
- **Expected URL**: `https://shyguyrymakesai.github.io/demo/`
- **Hash Routing**: `/#/` for home, `/#/habits` for habits page, etc.

## Steps to Debug

### 1. Verify Files Were Deployed
Check if files exist in the demo folder:
👉 https://github.com/shyguyrymakesai/shyguyrymakesai.github.io/tree/main/demo

You should see:
- `index.html`
- `assets/` folder with JS and CSS files
- `.nojekyll` file (might be hidden)

### 2. Check the Exact URL
Try these URLs in order:

1. **Base URL** (should load the app):
   ```
   https://shyguyrymakesai.github.io/demo/
   ```

2. **Hash Route** (should load home page):
   ```
   https://shyguyrymakesai.github.io/demo/#/
   ```

3. **Specific Route** (should load habits page):
   ```
   https://shyguyrymakesai.github.io/demo/#/habits
   ```

### 3. Browser Console Errors
1. Open the site: `https://shyguyrymakesai.github.io/demo/`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for errors like:
   - `Failed to load resource` (asset path issue)
   - `Uncaught SyntaxError` (build issue)
   - Router errors

### 4. Network Tab Check
1. Stay in DevTools
2. Go to **Network** tab
3. Refresh the page
4. Check if files are loading:
   - `index.html` - should be 200 OK
   - `assets/*.js` - should be 200 OK
   - `assets/*.css` - should be 200 OK

### 5. Common Issues & Fixes

#### Issue: 404 on demo folder
**Symptom**: "404 - File not found" when visiting `/demo/`
**Fix**: 
- Verify deployment ran successfully
- Check GitHub Actions logs
- Verify files are in `/demo/` folder in user site repo

#### Issue: Blank white page
**Symptom**: Page loads but shows nothing
**Fix**:
- Check browser console for errors
- Verify `base: '/demo/'` in vite.config.ts
- Check if assets are loading (Network tab)

#### Issue: Assets 404
**Symptom**: HTML loads but JS/CSS don't
**Fix**:
- Verify `base: '/demo/'` matches folder name exactly
- Check if `.nojekyll` file is present
- Clear browser cache (Ctrl+Shift+Delete)

#### Issue: Routes don't work
**Symptom**: Only home page works, other routes 404
**Fix**:
- Make sure you're using hash URLs: `/#/habits` not `/habits`
- Check that hash routing is enabled in main.tsx

### 6. Test Locally First
Before debugging live site, test locally:

```bash
npm run build
npm run preview
```

Then visit: `http://localhost:4173/demo/`

If it works locally but not on GitHub Pages, it's likely a deployment issue.

### 7. Workflow Verification
Check the last workflow run:
👉 https://github.com/shyguyrymakesai/habit_tracker/actions

Look for:
- ✅ Build job completed
- ✅ Publish job completed
- ✅ No error messages

### 8. Quick Fixes to Try

**Clear Browser Cache:**
```
Ctrl + Shift + Delete → Clear cached images and files
```

**Force Refresh:**
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

**Try Incognito Mode:**
Opens a fresh browser without cache

### 9. Expected File Structure in User Site

```
shyguyrymakesai.github.io/
├── demo/
│   ├── index.html
│   ├── .nojekyll
│   └── assets/
│       ├── index-[hash].js
│       └── index-[hash].css
└── (other site files)
```

### 10. What URL Are You Visiting?

Make sure you're visiting the correct URL structure:

✅ **Correct**: `https://shyguyrymakesai.github.io/demo/#/`
❌ **Wrong**: `https://shyguyrymakesai.github.io/#/demo`
❌ **Wrong**: `https://shyguyrymakesai.github.io/demo/habits`
✅ **Correct**: `https://shyguyrymakesai.github.io/demo/#/habits`

---

## Quick Checklist

- [ ] Workflow completed successfully (green checkmark)
- [ ] Files exist in `/demo/` folder on GitHub
- [ ] Visiting `https://shyguyrymakesai.github.io/demo/`
- [ ] Using hash routes: `/#/` not just `/`
- [ ] Browser console shows no errors
- [ ] Network tab shows assets loading (200 OK)
- [ ] Tried clearing cache
- [ ] Works locally with `npm run preview`

## Still Not Working?

If you've checked everything above, share:
1. The exact URL you're visiting
2. Any error messages from browser console
3. Screenshot of Network tab showing failed requests
4. Output from the GitHub Actions workflow
