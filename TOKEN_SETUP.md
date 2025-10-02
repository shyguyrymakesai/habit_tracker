# 🔐 Setting Up Deployment Token

To deploy from the `habit_tracker` repo to your user site (`shyguyrymakesai.github.io`), you need to create a Personal Access Token (PAT) and add it as a secret.

**Token Name**: `PAT_PUSH`

## Step 1: Create a Personal Access Token

1. Go to GitHub: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   
   Direct link: https://github.com/settings/tokens

2. Click **Generate new token** → **Generate new token (classic)**

3. Configure the token:
   - **Note**: `Deploy habit_tracker to user site`
   - **Expiration**: Choose your preference (90 days, 1 year, or no expiration)
   - **Scopes**: Check these boxes:
     - ✅ `repo` (Full control of private repositories)
       - This gives access to push to your shyguyrymakesai.github.io repo

4. Click **Generate token**

5. **⚠️ IMPORTANT**: Copy the token immediately! You won't be able to see it again.

## Step 2: Add Token to Repository Secrets

1. Go to your `habit_tracker` repository on GitHub

2. Click **Settings** → **Secrets and variables** → **Actions**
   
   Direct link: https://github.com/shyguyrymakesai/habit_tracker/settings/secrets/actions

3. Click **New repository secret**

4. Configure the secret:
   - **Name**: `PAT_PUSH`
   - **Value**: Paste the token you copied in Step 1

5. Click **Add secret**

## Step 3: Verify the Workflow

The workflow in `.github/workflows/deploy.yml` is now configured to:

1. Build your habit_tracker app
2. Checkout your user site repo (`shyguyrymakesai.github.io`) using the `PAT_PUSH` secret
3. Copy the built files to `habit_tracker/` folder in the user site
4. Commit and push the changes

## How It Works

```yaml
- name: Checkout user site repo
  uses: actions/checkout@v4
  with:
    repository: shyguyrymakesai/shyguyrymakesai.github.io
    path: site-repo
    token: ${{ secrets.PAT_PUSH }}  # Uses your PAT_PUSH secret
```

This step:
- Checks out your `shyguyrymakesai.github.io` repo
- Uses the `PAT_PUSH` secret to authenticate
- Clones it into the `site-repo` directory

Then the workflow:
1. Copies `dist/*` → `site-repo/habit_tracker/`
2. Commits the changes
3. Pushes to `shyguyrymakesai.github.io`

## Testing the Deployment

After setting up the token:

1. Push a change to the `main` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```

2. Check the Actions tab to see the workflow run:
   https://github.com/shyguyrymakesai/habit_tracker/actions

3. After successful deployment, visit:
   `https://shyguyrymakesai.github.io/habit_tracker/#/`

## Troubleshooting

### "Resource not accessible by integration"
- Make sure the token has `repo` scope
- Verify the token is added as `PAT_PUSH` (exact name)

### "Authentication failed"
- Check that the token hasn't expired
- Regenerate and update the secret if needed

### "Repository not found"
- Verify `shyguyrymakesai/shyguyrymakesai.github.io` exists
- Check the repository name in the workflow matches exactly

### Build succeeds but site doesn't update
- Check the `shyguyrymakesai.github.io` repo for the commit
- Look in the `habit_tracker/` folder in that repo
- Ensure GitHub Pages is enabled for the user site repo

## Security Notes

- ✅ The token is stored securely as a GitHub secret
- ✅ The token is never exposed in logs
- ✅ Only this repository can use this token
- ✅ You can revoke the token anytime from GitHub settings

## Alternative: Fine-grained Token (Recommended)

Instead of a classic token, you can use a fine-grained token with more specific permissions:

1. Go to: https://github.com/settings/tokens?type=beta
2. Click **Generate new token**
3. Configure:
   - **Name**: `Deploy habit_tracker`
   - **Expiration**: Your choice
   - **Repository access**: Only select repositories
     - Choose `shyguyrymakesai.github.io`
   - **Permissions**:
     - Repository permissions → Contents → Read and write
4. Generate and copy the token
5. Add it as `PAT_PUSH` secret (same as above)

This is more secure because it only has access to the specific repository you need.

---

**Once the token is set up, every push to `main` will automatically deploy! 🚀**
