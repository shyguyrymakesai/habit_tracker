# 🔴 Deployment Error - 403 Permission Denied

## Problem

The GitHub Actions workflow is getting a 403 error when trying to push to `shyguyrymakesai.github.io`:

```
remote: Permission to shyguyrymakesai/shyguyrymakesai.github.io.git denied to shyguyrymakesai.
fatal: unable to access 'https://github.com/shyguyrymakesai/shyguyrymakesai.github.io/': The requested URL returned error: 403
```

## Root Cause

The `PAT_PUSH` token either:
1. Doesn't have sufficient permissions
2. Has expired
3. Wasn't added to the correct repository

## ✅ Solution

### Step 1: Create a New Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens
   **Link**: https://github.com/settings/tokens

2. Click **"Generate new token"** → **"Generate new token (classic)"**

3. Configure the token:
   - **Note**: `Deploy habit_tracker to user site`
   - **Expiration**: Choose your preference (recommend 90 days or 1 year)
   - **Scopes**: ✅ Check **`repo`** (Full control of private repositories)
     - This includes:
       - ✅ repo:status
       - ✅ repo_deployment
       - ✅ public_repo
       - ✅ repo:invite
       - ✅ security_events

4. Scroll down and click **"Generate token"**

5. **⚠️ COPY THE TOKEN IMMEDIATELY** - You won't be able to see it again!

### Step 2: Update the Secret in habit_tracker Repository

1. Go to your habit_tracker repository settings:
   **Link**: https://github.com/shyguyrymakesai/habit_tracker/settings/secrets/actions

2. Find the existing `PAT_PUSH` secret and click the pencil icon to edit it
   - OR delete it and create a new one

3. Update the secret:
   - **Name**: `PAT_PUSH` (keep the same name)
   - **Value**: Paste your new token

4. Click **"Update secret"** (or "Add secret" if you created new)

### Step 3: Re-run the Workflow

1. Go to the Actions tab:
   **Link**: https://github.com/shyguyrymakesai/habit_tracker/actions

2. Find the failed workflow run

3. Click **"Re-run all jobs"**

OR simply push a new commit:
```bash
git commit --allow-empty -m "Trigger deployment with new token"
git push origin main
```

## 🔍 Verify Token Permissions

To check if your token has the right permissions:

1. Go to: https://github.com/settings/tokens
2. Find your token (named "Deploy habit_tracker to user site")
3. Verify it shows:
   - ✅ **repo** (with green checkmark)
   - Expiration date is in the future

## Alternative: Fine-Grained Token (More Secure)

Instead of a classic token, you can use a fine-grained token:

1. Go to: https://github.com/settings/tokens?type=beta

2. Click **"Generate new token"**

3. Configure:
   - **Token name**: `Deploy habit_tracker`
   - **Expiration**: Your choice
   - **Repository access**: ⚪ Only select repositories
     - Select: `shyguyrymakesai.github.io` ✅
   - **Permissions**:
     - Repository permissions → **Contents** → **Read and write** ✅

4. Click **"Generate token"** and copy it

5. Update `PAT_PUSH` secret with this new token

This is more secure because it only has access to the specific repository.

## 📝 Checklist

- [ ] Generated new PAT with `repo` scope
- [ ] Copied the token value
- [ ] Updated `PAT_PUSH` secret in habit_tracker repo
- [ ] Re-ran the failed workflow OR pushed a new commit
- [ ] Verified workflow completes successfully
- [ ] Checked that files appeared in `shyguyrymakesai.github.io/habit_tracker/`

## 🎯 Expected Result

After fixing the token, the workflow should:
1. ✅ Build your app successfully
2. ✅ Checkout user site repo (no 403 error)
3. ✅ Copy files to `/habit_tracker/` folder
4. ✅ Commit and push successfully
5. ✅ Your site live at: https://shyguyrymakesai.github.io/habit_tracker/#/

## 🆘 Still Having Issues?

### Double-check:
1. Token has **`repo`** scope (not just `public_repo`)
2. Token hasn't expired
3. Secret is named exactly **`PAT_PUSH`** (case-sensitive)
4. Secret is in the **habit_tracker** repository (not the user site repo)
5. You copied the entire token (no extra spaces)

### Debug in Workflow
The workflow successfully:
- ✅ Built the app
- ✅ Created the commit locally
- ❌ Failed when pushing

This confirms the token is being used, but doesn't have push permissions.

---

**Next Step**: Create a new token with full `repo` scope and update the `PAT_PUSH` secret!
