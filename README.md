# TaskFlow (demo app)

A small **Vite + React + TypeScript** app, run on **Bun**, meant as a lightweight sandbox for
trying out QA/testing tooling — in particular [Meticulous.ai](https://www.meticulous.ai/) — before
wiring it into a larger, real project. It mirrors the shape of a typical mid-size React app:

- multi-page routing with an authenticated app shell (`react-router-dom`)
- forms with client + "server" side validation and error states
- an async, mock network layer with realistic latency (and a way to trigger failures on demand)
- a small reusable UI kit (buttons, inputs, modal, badges, cards, table…)
- unit/integration tests with Vitest + React Testing Library
- ESLint + Prettier
- a CI workflow, plus an optional Meticulous CI workflow

## The app

**TaskFlow** is a minimal task-tracking dashboard:

- `/login` — sign-in form (demo credentials pre-filled, see below)
- `/` — dashboard with stats cards + recent tasks
- `/tasks` — searchable/filterable task table, create/delete tasks, change status
- `/settings` — a profile form

Demo credentials (there's no real backend, just an in-memory mock — see
[`src/services/api.ts`](src/services/api.ts)):

```
email:    avery@taskflow.dev
password: password123
```

A couple of deliberate "escape hatches" are built in so QA flows and tooling like Meticulous have
interesting states to exercise:

- Signing in with any other password shows a realistic error banner.
- Creating a task titled `fail` (case-insensitive) simulates a server error.

## Getting started

This project uses [Bun](https://bun.sh) as the package manager and dev runtime.

```bash
# install Bun if you don't have it yet
curl -fsSL https://bun.sh/install | bash

# install dependencies
bun install

# start the dev server (http://localhost:5173)
bun run dev
```

### Other scripts

| Command                 | Description                                   |
| ----------------------- | --------------------------------------------- |
| `bun run dev`           | Start the Vite dev server                     |
| `bun run build`         | Type-check and build for production (`dist/`) |
| `bun run preview`       | Preview the production build locally          |
| `bun run test`          | Run the test suite once                       |
| `bun run test:watch`    | Run tests in watch mode                       |
| `bun run test:coverage` | Run tests with coverage                       |
| `bun run lint`          | Lint with ESLint                              |
| `bun run typecheck`     | Type-check without emitting                   |
| `bun run format`        | Format the codebase with Prettier             |
| `bun run format:check`  | Check formatting without writing              |

## Project structure

```
src/
  components/
    ui/        Reusable primitives: Button, Input, Select, Textarea, Card, Badge, Modal, EmptyState
    layout/    App shell: Sidebar, Topbar, AppLayout, ProtectedRoute
    tasks/     Feature components: StatsCards, TaskTable, TaskFormModal
  context/     AuthContext (holds the signed-in user)
  hooks/       useAuth, useTasks (data loading + mutations)
  pages/       LoginPage, DashboardPage, TasksPage, SettingsPage, NotFoundPage
  services/    api.ts — the mock "backend" (async, with latency + simulated errors)
  data/        Seed data used by the mock backend
  types/       Shared TypeScript types
  test/        Test setup + a renderWithProviders helper
```

## Testing with Meticulous.ai

[Meticulous](https://www.meticulous.ai/) records real user sessions and replays them against new
builds to catch visual/behavioral regressions automatically, without hand-written E2E tests. This
project is already wired up for it end-to-end; you just need to add your own project token.

### 1. Record sessions locally (and in staging/CI)

The [`@alwaysmeticulous/recorder-plugin`](https://www.npmjs.com/package/@alwaysmeticulous/recorder-plugin)
dev dependency is already configured in [`vite.config.ts`](vite.config.ts). It injects the
Meticulous recorder `<script>` tag automatically, but **only when a recording token is present** —
so the app works normally out of the box with zero Meticulous setup.

To turn recording on:

1. Sign up at [app.meticulous.ai](https://app.meticulous.ai/signup) and create a project.
2. Grab the project's recording token from the Meticulous dashboard.
3. Copy `.env.example` to `.env.local` and set it:

   ```
   VITE_METICULOUS_RECORDING_TOKEN=<your-recording-token>
   ```

4. **Restart `bun run dev`** (this is required — the token is read when the dev server starts, so a
   running server won't pick up a newly-added `.env.local`). Then hard-refresh the page, view source,
   and confirm a `<script ... src="https://snippet.meticulous.ai/...">` tag is present in `<head>`
   and that `window.Meticulous` exists in the browser console.

`.env.local` is git-ignored, so your token stays local. See
[Meticulous's recorder docs](https://app.meticulous.ai/docs/recorder-installation) for more on
where else to enable recording (e.g. a staging deployment).

> **Not seeing the recorder / no sessions in Meticulous?** The most common cause is the dev server
> not having been restarted after creating `.env.local`. The token is read at startup via Vite's
> `loadEnv` (see [`vite.config.ts`](vite.config.ts)); if the `<script src="…meticulous…">` tag is
> missing from the page source, the token isn't being picked up — double-check the file is named
> exactly `.env.local`, the var is `VITE_METICULOUS_RECORDING_TOKEN`, and you restarted the server.

### 1b. Record sessions from a live preview (no local IDE needed)

If you're not running the app from a local IDE, you can record sessions against a **deployed preview**
instead. [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) builds the app and
publishes it to **GitHub Pages** at `https://<your-user>.github.io/<repo>/`, so you can just open that
URL in a browser and click around to generate sessions.

One-time setup:

1. In GitHub: **Settings → Pages → Build and deployment → Source = "GitHub Actions"**. This step is
   **required and manual** — GitHub Pages can't be enabled from a workflow with the default token, so
   the deploy workflow is manual-only to avoid failing checks before you've done this.
2. (To record on the preview) add a repository secret named `METICULOUS_RECORDING_TOKEN`
   (**Settings → Secrets and variables → Actions**) with your Meticulous recording token. The Pages
   build injects it so the recorder is active on the deployed site. Recording tokens are client-side
   by design, so it's fine that it ends up in the shipped JS.
3. Run the deploy: **Actions → "Deploy preview to GitHub Pages" → Run workflow**. When it finishes,
   open the Pages URL, interact with the app, and confirm `window.Meticulous` exists in the browser
   console. (Once Pages is enabled, you can re-add a `push:` trigger to the workflow if you want it to
   auto-deploy on every merge to `main`.)

The base path and client-side routing are handled automatically for the `/<repo>/` subpath, and a
`404.html` fallback is generated so deep links / refreshes work.

> Prefer per-PR preview URLs? Meticulous also supports Vercel/Netlify preview deployments via Cloud
> Replay — see the [onboarding guide](https://app.meticulous.ai/docs/onboarding-guide). GitHub Pages
> is used here because it needs no extra accounts.

### 2. Run Meticulous tests in CI

[`.github/workflows/meticulous.yml`](.github/workflows/meticulous.yml) builds the app and uploads
the static `dist/` output to Meticulous on every push to `main` and every pull request, using the
[`upload-assets`](https://github.com/alwaysmeticulous/report-diffs-action) action (the recommended
approach for static SPAs like this one).

To enable it:

1. In the Meticulous dashboard, copy your project's **API token** (this is different from the
   recording token above).
2. Add it as a repository secret named `METICULOUS_API_TOKEN` (Repo Settings → Secrets and
   variables → Actions).

Until that secret exists, the workflow still runs your normal build but skips the Meticulous step,
so it won't break CI on a fresh clone. Once the token is added, every PR gets a Meticulous status
check comparing it against the base branch, with a link to review any diffs.

### Applying this to your real project

The pattern here — a bundler plugin gated on an env var for recording, plus a CI job that uploads
build output and is gated on a secret — is deliberately the same shape you'd use in a larger app.
The main things to adapt when moving to your real project:

- If it's server-rendered (Next.js, etc.), use the
  [`upload-container`](https://app.meticulous.ai/docs/github-actions-v2) action instead of
  `upload-assets`.
- Swap the mock `src/services/api.ts` for real network calls — Meticulous records and replays
  network responses too, which is most of the value once there's a real backend.
