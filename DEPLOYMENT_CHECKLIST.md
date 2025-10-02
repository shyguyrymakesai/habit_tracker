# ✅ Deployment Checklist

Follow these steps in order to deploy your Habit Tracker to `shyguyrymakesai.github.io/demo/`

## Prerequisites

- [ ] Your user site repo exists: `shyguyrymakesai/shyguyrymakesai.github.io`
- [ ] GitHub Pages is enabled on the user site repo
- [ ] You have access to both repositories

## Setup Steps

### Step 1: Create Personal Access Token (PAT)

- [ ] Go to GitHub Settings → Developer settings → Personal access tokens
      https://github.com/settings/tokens
      
- [ ] Click "Generate new token (classic)"

- [ ] Configure the token:
  - [ ] Name: `Deploy habit_tracker to user site`
  - [ ] Expiration: Choose your preference
  - [ ] Scope: Check `repo` (Full control of private repositories)
  
- [ ] Click "Generate token"

- [ ] **Copy the token** (you won't see it again!)

### Step 2: Add Token as Repository Secret

- [ ] Go to habit_tracker repo: Settings → Secrets and variables → Actions
      https://github.com/shyguyrymakesai/habit_tracker/settings/secrets/actions
      
- [ ] Click "New repository secret"

- [ ] Configure the secret:
  - [ ] Name: `PAT_PUSH` (exactly this name!)
  - [ ] Value: Paste the token you copied
  
- [ ] Click "Add secret"

### Step 3: Deploy

- [ ] Commit all your changes:
  ```bash
  git add .
  git commit -m "Configure deployment to user site"
  git push origin main
  ```

- [ ] Watch the deployment:
  - [ ] Go to Actions tab: https://github.com/shyguyrymakesai/habit_tracker/actions
  - [ ] Wait for workflow to complete (usually 1-2 minutes)
  - [ ] Check for green checkmark ✅

### Step 4: Verify

- [ ] Check the user site repo for new files:
  https://github.com/shyguyrymakesai/shyguyrymakesai.github.io/tree/main/demo
      
- [ ] Visit your live site:
  https://shyguyrymakesai.github.io/demo/#/
      
- [ ] Test navigation:
  - [ ] Home page loads
  - [ ] Navigate to Habits
  - [ ] Navigate to Quotes
  - [ ] Refresh the page (should stay on same route)

## Troubleshooting

### Workflow fails with "Resource not accessible"
- [ ] Verify token has `repo` scope
- [ ] Check token is named `PAT_PUSH` exactly
- [ ] Try regenerating the token

### Workflow fails with "Repository not found"
- [ ] Verify `shyguyrymakesai/shyguyrymakesai.github.io` exists
- [ ] Check the repository name in `.github/workflows/deploy.yml`

### Build succeeds but site doesn't update
- [ ] Check commits in the user site repo
- [ ] Look for `/demo/` folder in user site repo
- [ ] Verify GitHub Pages is enabled on user site
- [ ] Wait a few minutes for Pages to rebuild

### 404 Error on live site
- [ ] Check `base: './'` in `vite.config.ts`
- [ ] Verify files are in `/demo/` folder in user site repo
- [ ] Check GitHub Pages settings on user site repo

## Ongoing Usage

Once set up, deployment is automatic:

- [ ] Make changes to your code
- [ ] Commit and push to `main` branch
- [ ] GitHub Actions automatically builds and deploys
- [ ] Site updates in 1-2 minutes

## Quick Reference

| Item | Value |
|------|-------|
| Source Repo | `shyguyrymakesai/habit_tracker` |
| Target Repo | `shyguyrymakesai/shyguyrymakesai.github.io` |
| Target Folder | `/demo/` |
| Secret Name | `PAT_PUSH` |
| Live URL | `https://shyguyrymakesai.github.io/demo/#/` |
| Workflow File | `.github/workflows/deploy-to-user-site.yml` |

---

**Need help?** See `TOKEN_SETUP.md` for detailed token setup instructions.
