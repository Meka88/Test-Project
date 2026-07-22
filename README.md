# Flightdeck — Vite + React + Bun (Meticulous.AI demo)

A small, realistic single-page app for evaluating [Meticulous.AI](https://www.meticulous.ai)
inside a QA workflow. It mirrors a typical internal tool: a sidebar layout, a
dashboard with stats, a tasks table with create/filter/delete/status flows, a
settings form, and simulated async loading — i.e. plenty of interactions for
Meticulous to record and replay.

**Stack:** [Vite](https://vite.dev) · [React 19](https://react.dev) +
TypeScript · [React Router](https://reactrouter.com) · [Bun](https://bun.sh)
(runtime + package manager) · [Meticulous](https://www.meticulous.ai) (visual
regression testing).

---

## Prerequisites

- [Bun](https://bun.sh) ≥ 1.3 (`curl -fsSL https://bun.sh/install | bash`)

## Getting started

```bash
bun install      # install dependencies
bun run dev      # start the dev server at http://localhost:5173
```

Other scripts:

```bash
bun run build      # type-check + production build to ./dist
bun run preview    # preview the production build
bun run serve      # serve the production build on http://localhost:3000
bun run lint       # eslint
bun run typecheck  # tsc --noEmit
```

## Project structure

```
.
├─ index.html                     # Meticulous recorder snippet lives here (first <head> script)
├─ .github/workflows/meticulous.yml  # Meticulous CI check
├─ src/
│  ├─ main.tsx                    # app entry (Router + context providers)
│  ├─ App.tsx                     # routes
│  ├─ components/                 # Layout, Modal, TaskForm, StatCard, Badge
│  ├─ context/AppContext.tsx      # tasks + settings state (localStorage-backed)
│  ├─ lib/storage.ts              # tiny persistence layer that fakes network latency
│  ├─ data/seed.ts                # seed tasks / team members
│  └─ pages/                      # Dashboard, Tasks, Settings, NotFound
└─ ...
```

---

## Setting up Meticulous

Meticulous records real user sessions on non-production environments (like
localhost) and, on every pull request, replays those sessions against your
branch to surface visual/behavioural differences — no test scripts to write or
maintain.

### 1. Install the session recorder

The recorder snippet is already wired into [`index.html`](./index.html) as the
**first** `<script>` in `<head>` (it must load before anything else so it can
capture all network activity):

```html
<script
  data-project-id="YOUR_PROJECT_ID"
  src="https://snippet.meticulous.ai/v1/meticulous.js"
></script>
```

To activate it:

1. Sign up at [app.meticulous.ai/signup](https://app.meticulous.ai/signup) and
   create an organization + project.
2. Copy your **Project ID** from the dashboard (Project Settings).
3. Replace `YOUR_PROJECT_ID` in `index.html` with it.

Then run the app locally (`bun run dev`) and click around. The recorder captures
sessions on localhost automatically; you should see them appear in your
Meticulous dashboard. `window.Meticulous` being defined in the browser console
confirms the snippet loaded.

> The recorder only records on localhost and other non-production environments by
> default, so it is safe to commit the snippet. For production recording, contact
> Meticulous support.

> **Vite tip:** Meticulous also ships an official `@alwaysmeticulous/recorder-plugin`
> Vite plugin that injects the snippet at build time (so you can scope it to
> specific environments without editing `index.html`). The plain script tag used
> here is the simplest way to get going while evaluating the tool.

### 2. Run tests in CI

[`.github/workflows/meticulous.yml`](./.github/workflows/meticulous.yml) builds
the app with Bun and uploads the static `dist/` output using
[`report-diffs-action/upload-assets`](https://github.com/alwaysmeticulous/report-diffs-action)
— the recommended approach for static Vite sites. Meticulous hosts the build and
runs the replays on its own infrastructure.

To enable it:

1. In the Meticulous dashboard, open **Project Settings** and copy your **API token**.
2. In GitHub: **Repo → Settings → Secrets and variables → Actions → New repository secret**.
3. Name it `METICULOUS_API_TOKEN` and paste the token.

Open a pull request and Meticulous will post a status check with a link to review
any differences it detects. A reviewer accepts (updates the baseline) or rejects
each diff.

Docs: [Recorder installation](https://app.meticulous.ai/docs/recorder-installation)
· [GitHub Actions setup](https://app.meticulous.ai/docs/github-actions-v2)

---

## Notes

- Data is stored in `localStorage`, so the app has no backend to run. Use
  **Settings → Reset demo data** to restore the seed tasks.
- The `lib/storage.ts` layer adds artificial latency (`VITE_API_LATENCY_MS`, see
  `.env.example`) so you get realistic loading skeletons to record.
