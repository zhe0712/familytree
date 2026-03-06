# Family Tree

React + Vite family tree app.

## Local Development

```bash
npm install
npm run dev
```

## Deploy To GitHub Pages

This project is configured with GitHub Actions at `.github/workflows/deploy-pages.yml`.
Pushing to `main` will automatically build and deploy to GitHub Pages.

### 1. Create a GitHub repository

Create an empty repository on GitHub, for example: `familytree`.

### 2. Push this project

```bash
git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<YOUR_USERNAME>/familytree.git
git push -u origin main
```

### 3. Enable GitHub Pages

In GitHub repository settings:

1. Open `Settings`.
2. Open `Pages`.
3. Under `Build and deployment`, select `Source: GitHub Actions`.

After push, check the `Actions` tab. When workflow completes, your site URL will be:

- `https://<YOUR_USERNAME>.github.io/familytree/` for project repositories
- `https://<YOUR_USERNAME>.github.io/` for `<YOUR_USERNAME>.github.io` repository
