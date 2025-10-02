# 🚀 GitHub Pages Deployment Guide

This guide explains how the Habit Tracker deploys to your GitHub user site (`shyguyrymakesai.github.io`) using hash-based routing.

## Configuration Overview

### Deployment Strategy
The app deploys from the `habit_tracker` repository to your **user site repository** (`shyguyrymakesai.github.io`):
- Source repo: `shyguyrymakesai/habit_tracker`
- Target repo: `shyguyrymakesai/shyguyrymakesai.github.io`
- Target folder: `/habit_tracker/`
- Live URL: `https://shyguyrymakesai.github.io/habit_tracker/#/`

### Hash-Based Routing
The app uses **hash-based routing** (`/#/page`) instead of traditional path-based routing (`/page`). This is necessary for GitHub Pages because:
- GitHub Pages serves static files only
- It cannot handle client-side routing for paths like `/habits` or `/trends`
- Hash fragments (`#/habits`) are handled entirely by the browser and never sent to the server
- This means all routes work correctly even after refresh

### Files Configured

#### 1. `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/habit_tracker/', // Set base path for GitHub Pages
})
```
- `base` is set to match your repository name
- This ensures all assets load from the correct path

#### 2. `package.json`
```json
{
  "homepage": "https://shyguyrymakesai.github.io/habit_tracker",
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```
- `homepage` tells the app where it will be hosted
- `deploy` script builds and deploys to `gh-pages` branch

#### 3. `src/main.tsx`
Uses hash-based navigation:
```typescript
const getHashPath = () => {
  const hash = window.location.hash.slice(1); // Remove the '#'
  return hash || '/';
};

window.addEventListener('hashchange', handleHashChange);
```

#### 4. `.github/workflows/deploy.yml`
Automatic deployment on push to `main`:
- Builds the app in the `habit_tracker` repo
- Checks out the `shyguyrymakesai.github.io` repo using `PAT_PUSH` secret
- Copies built files to `/habit_tracker/` folder
- Commits and pushes to the user site repo
- Deploys automatically

**⚠️ Requires Setup**: You must create a Personal Access Token (PAT) and add it as a secret named `PAT_PUSH`. See `TOKEN_SETUP.md` for detailed instructions.

#### 5. `public/.nojekyll`
Tells GitHub Pages not to use Jekyll processing, which can interfere with React apps.

## URLs

### Production URLs
- **Base URL**: `https://shyguyrymakesai.github.io/habit_tracker`
- **Home**: `https://shyguyrymakesai.github.io/habit_tracker/#/`
- **Habits**: `https://shyguyrymakesai.github.io/habit_tracker/#/habits`
- **Quotes**: `https://shyguyrymakesai.github.io/habit_tracker/#/quotes`
- **Trends**: `https://shyguyrymakesai.github.io/habit_tracker/#/trends`

The hash (`#`) ensures that all navigation works correctly without server-side routing.

## Deployment Methods

### Method 1: Automatic (Recommended)

**Prerequisites**: 
1. Create a Personal Access Token - see `TOKEN_SETUP.md`
2. Add it as `PAT_PUSH` secret in the habit_tracker repo

**Deploy**:
1. Push to the `main` branch:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
2. GitHub Actions automatically builds and deploys to `shyguyrymakesai.github.io/habit_tracker/`
3. Check the Actions tab on GitHub to see deployment status
4. Site updates in 1-2 minutes at `https://shyguyrymakesai.github.io/habit_tracker/#/`

### Method 2: Manual
1. Build the project:
   ```bash
   npm run build
   ```
2. Manually copy `dist/*` to your `shyguyrymakesai.github.io` repo in the `habit_tracker/` folder
3. Commit and push to the user site repo

## GitHub Pages Settings

Your **user site** repository (`shyguyrymakesai.github.io`) should have:

1. Go to repository Settings → Pages
2. Under **Source**, select:
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`)
   - **Folder**: `/ (root)`
3. Click **Save**

The habit_tracker app will be available at `/habit_tracker/` within your user site.

## First-Time Setup

### 1. Create Personal Access Token
Follow the instructions in `TOKEN_SETUP.md` to:
- Generate a PAT with `repo` scope
- Add it as `DEPLOY_TOKEN` secret in the habit_tracker repo

### 2. Enable GitHub Pages on User Site
1. Ensure `shyguyrymakesai.github.io` repository exists
2. Enable GitHub Pages (Settings → Pages)
3. Choose main branch as source

### 3. Deploy
1. Push your code to the `main` branch of habit_tracker
2. GitHub Actions will automatically deploy
3. Visit `https://shyguyrymakesai.github.io/habit_tracker/#/`

## Troubleshooting

### 404 Error
- Check that `base` in `vite.config.ts` matches your repo name
- Verify GitHub Pages is enabled in settings
- Check the `gh-pages` branch exists and has files

### Blank Page
- Open browser console for errors
- Check if assets are loading from correct path
- Verify `base` path in vite.config.ts

### Routes Don't Work After Refresh
- Ensure you're using hash routing (`#/page` not `/page`)
- Check that `.nojekyll` file exists in `public/` folder

### Assets Not Loading
- Verify `base: '/habit_tracker/'` in vite.config.ts
- Check that public files are in the `public/` folder
- Clear browser cache

## Local Testing

To test the production build locally:

```bash
npm run build
npm run preview
```

This will serve the production build at `http://localhost:4173` with the correct base path.

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to `public/` folder with your domain
2. Configure DNS settings with your domain provider
3. Update `homepage` in package.json to your custom domain

## Notes

- All data is stored in browser localStorage (IndexedDB)
- No backend server required
- Works completely offline after first load
- Users' data stays on their device only
- Export/import features allow data backup

---

**Your app is now configured for GitHub Pages with hash routing! 🎉**

Access it at: `https://shyguyrymakesai.github.io/habit_tracker/#/`
