---
name: run-squirrel-pi
description: Run, smoke test, screenshot, and verify squirrel-pi (allibuild.com) — a Next.js 16 AI website builder. Use when asked to run, start, test, screenshot, or verify the app.
---

Squirrel Pi is a Next.js 16 App Router app deployed to **allibuild.com** via Vercel. Auth is Clerk. The driver is a Playwright smoke script at `.claude/skills/run-squirrel-pi/driver.cjs`. It runs headless against production (or optionally localhost).

**Paths below are relative to `squirrel-pi/` (the Next.js project root).**

---

## Prerequisites

Playwright must be installed in the project:

```bash
npm install --save-dev playwright
```

Playwright's bundled Chromium ships with the package on macOS — no separate `npx playwright install` needed (it warned about a frozen ffmpeg build on mac12 but launched fine).

---

## Run (agent path) — smoke driver

```bash
# Smoke production (allibuild.com) — all 5 checks, 2 screenshots
node .claude/skills/run-squirrel-pi/driver.cjs

# Smoke a different base URL
BASE_URL=https://squirrel-9evs92rsr-lucianvirtic-7457s-projects.vercel.app \
  node .claude/skills/run-squirrel-pi/driver.cjs

# Custom screenshot output dir
SS_DIR=/tmp/ss node .claude/skills/run-squirrel-pi/driver.cjs
```

**Checks run:**
1. `/sign-in` — page loads, Clerk widget renders (`<form>` present)
2. `/dashboard` — redirects to `/sign-in` (auth gate works)
3. `/builder` — redirects to `/sign-in` (auth gate works)
4. `POST /api/stripe/webhook` — returns `400 {"error":"Missing signature"}` (reachable, not 404)
5. `/sign-up` — page loads, form present

**Screenshots land in `.claude/skills/run-squirrel-pi/screenshots/`.**

Exit code 0 = all pass. Exit code 1 = at least one failure.

---

## Run (human path) — dev server

```bash
npm run dev        # starts on :3000 (or next available port if 3000 is taken)
```

Then open [http://localhost:3000](http://localhost:3000) — but see **Gotchas** below before expecting it to work.

---

## Deploy

```bash
vercel             # preview deploy
vercel --prod      # production → allibuild.com
```

---

## Gotchas

**Production Clerk keys block localhost.** `.env.local` contains production keys (`pk_live_*`) locked to `allibuild.com`. Running `npm run dev` on localhost produces `origin_invalid` from Clerk's API — every page stays on the splash screen forever. The app looks broken but isn't.

**Fix for local dev:** Create a Clerk *Development* instance at dashboard.clerk.com, grab `pk_test_*` + `sk_test_*` keys, add them to `.env.local`. Dev keys allow any origin.

**Without dev keys the smoke driver must target production**, not localhost. `BASE_URL=http://localhost:3000` will cause the sign-in check to fail (no `<form>` rendered).

**All routes except `/sign-in`, `/sign-up`, `/api/stripe/webhook` require auth.** Middleware (`middleware.ts`) calls `auth.protect()` on everything else — unauthenticated hits redirect to `/sign-in?redirect_url=…`.

**Port conflict.** If port 3000 is occupied (e.g. another dev session), Next.js silently picks 3002. Check the terminal output for the actual port.

**`playwright` must be installed separately.** Not in `package.json` by default. Run `npm install --save-dev playwright` first.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Splash screen, never loads | Production Clerk keys reject `localhost` origin — use dev keys or smoke prod |
| `Cannot find package 'playwright'` | `npm install --save-dev playwright` |
| Driver: `No sign-in form found` | Clerk JS failed to hydrate — check `BASE_URL` is correct and reachable |
| `vercel: command not found` | `npm i -g vercel` |
| Dev server starts on wrong port | Another `next dev` already running on :3000 — kill PID shown in terminal or use the alternate port |
