# Holeo

A cozy, stylized 2.5D progressively growing hole game built for both mobile Safari and desktop. Start small swallowing flower pots and traffic cones, then grow big enough to devour benches, cars, pine trees, cottages, and whole skyscrapers!

- **Live site (once GitHub Pages is enabled):** https://sofakodev.github.io/holeo/
- **Modes:**
  - **Relaxed Sandbox:** No timer — swallow the entire town at your own pace.
  - **2-Minute Arcade:** Race the clock to grow as huge as possible and beat your local high score.
- **Controls:** Touch & drag anywhere on mobile, move/drag with mouse, or steer with **WASD / Arrow keys**.

## Local Development

```powershell
npm install
npm run dev
```

Open http://localhost:5174/.

## Tests & Production Build

```powershell
npm test
npm run build
```

## Contributing & Deployment Workflow

Never push directly to `main`. Create a feature branch, run tests, push your branch, and open a Pull Request targeting `main`:

```powershell
git checkout -b feat/my-change
npm test
npm run build
git add .
git commit -m "Describe the change"
git push -u origin feat/my-change
gh pr create --base main
```

Once merged into `main`, GitHub Actions automatically runs tests, builds the site under `/holeo/`, and deploys to GitHub Pages (**Settings → Pages → Source: GitHub Actions**).
