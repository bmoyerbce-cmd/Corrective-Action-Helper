# Supervisor Counseling / Disciplinary Form Builder

This repository contains a GitHub-ready version of the Supervisor Counseling / Disciplinary Form Builder.

## Included Files

- `index.html` — the full standalone application
- `.nojekyll` — helps GitHub Pages serve the site exactly as-is
- `README.md` — setup and deployment instructions

## What This Tool Does

The app allows supervisors to:

- choose a form type:
  - Counseling
  - Verbal Warning
  - Written Warning
  - Final Warning
  - Business Case
  - Job Abandonment
- choose a contract preset
- choose a reason template
- use dedicated Business Case and Job Abandonment forms
- fill in the form directly in the browser
- export the completed form to Word and PDF
- use the Admin tab to manage reason templates and contract-specific options

## Admin Access

Admin password:

`Titan2026!$`

## GitHub Upload Instructions

### Option 1: Upload directly in GitHub

1. Create a new GitHub repository.
2. Open the repository.
3. Click **Add file** → **Upload files**.
4. Upload all files from this folder:
   - `index.html`
   - `README.md`
   - `.nojekyll`
5. Commit the files.

### Option 2: Push from your computer

1. Download this package.
2. Extract it.
3. Open the extracted folder in your code editor.
4. Initialize git if needed:
   ```bash
   git init
   ```
5. Connect your GitHub repo:
   ```bash
   git remote add origin YOUR_REPO_URL
   ```
6. Commit and push:
   ```bash
   git add .
   git commit -m "Initial upload"
   git branch -M main
   git push -u origin main
   ```

## GitHub Pages Deployment

To publish this tool as a live website:

1. Open your GitHub repository.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment**, choose:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Save.
5. Wait for GitHub Pages to publish the site.

Your live site will usually be available at:

`https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

## Notes

- This build is designed as a standalone file so it can be hosted easily on GitHub.
- The app uses a single `index.html` file for simple deployment.
- If you replace the app later, keep the file name as `index.html` for GitHub Pages.

## Recommended Repo Name

A good repository name would be:

`supervisor-counseling-tool`

## Support / Future Updates

Possible future improvements:

- more contract-specific templates
- better admin template management
- import/export for admin settings
- branding customization
