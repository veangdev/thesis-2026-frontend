# PNC Journey Star — Frontend

Production-grade **Next.js (App Router) + TypeScript** frontend for the PNC
Students' Journey Star System — tracking student transformation from learning to
employment across eight skill dimensions, for **Students**, **Mentors**, and
**Managers**.

> The landing page currently doubles as a public, temporary dashboard. The
> authentication / RBAC layer is fully scaffolded but **intentionally not
> enforced** until the backend API is ready.

---

## Tech stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Framework        | Next.js 16 (App Router, Turbopack)    |
| Language         | TypeScript (strict)                   |
| Styling          | Tailwind CSS v4 + design tokens       |
| UI components    | shadcn/ui (Radix primitives)          |
| Theming          | next-themes (light / dark / system)   |
| Server state     | TanStack React Query                  |
| UI state         | Zustand                               |
| Forms/validation | React Hook Form + Zod                 |
| HTTP             | Typed `fetch` client (`src/services`) |
| Testing          | Playwright (e2e)                      |
| Tooling          | ESLint, Prettier, Husky, lint-staged  |
| Container        | Docker + Docker Compose (multi-stage) |
| CI/CD            | GitHub Actions                        |
| Package manager  | **Yarn only**                         |

---

## Project structure

```text
src/
├── app/
│   ├── (public)/          # Public routes — landing page (temp dashboard)
│   ├── (dashboard)/       # Dashboard shell (publicly accessible for now)
│   ├── api/health/        # Health-check route handler
│   ├── layout.tsx         # Root layout (providers, theme, toaster)
│   ├── loading.tsx        # Global loading UI
│   ├── error.tsx          # Route error boundary
│   ├── global-error.tsx   # App-level error boundary
│   └── not-found.tsx      # 404 page
├── components/
│   ├── ui/                # shadcn/ui primitives (generated)
│   ├── shared/            # Reusable cross-feature components & UI states
│   ├── layouts/           # Navbar, footer, sidebar, topbar
│   └── features/          # Feature-specific components (e.g. landing/)
├── config/                # env (typed) + site config
├── constants/             # api, routes, roles, app constants
├── features/auth/         # Auth + RBAC foundation (service, store, guards)
├── hooks/                 # use-debounce, use-disclosure, use-media-query
├── lib/                   # utils (cn, formatters) + auth/token helpers
├── services/              # Typed API client
├── stores/                # Zustand UI store
├── types/                 # api / auth / common types
└── proxy.ts               # Next 16 "proxy" (formerly middleware) — gate disabled
tests/e2e/                 # Playwright tests
```

> **Next.js 16 note:** this project follows Next 16 conventions — middleware is
> now [`proxy.ts`](src/proxy.ts), linting runs via the ESLint CLI (not
> `next lint`), and Turbopack is the default bundler.

---

## Getting started

### Prerequisites

- Node.js ≥ 20.9
- Yarn 1.x (Classic)

### Install & run

```bash
yarn install
cp .env.example .env.local
yarn dev
# open http://localhost:3000
```

---

## Environment variables

Configured centrally and validated in [`src/config/env.ts`](src/config/env.ts).
Only `NEXT_PUBLIC_*` variables reach the browser.

| Variable                   | Description                 | Default                        |
| -------------------------- | --------------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_APP_NAME`     | Public application name     | `PNC Journey Star`             |

See [`.env.example`](.env.example).

---

## Commands

| Command             | Description                           |
| ------------------- | ------------------------------------- |
| `yarn dev`          | Start the dev server (Turbopack)      |
| `yarn build`        | Production build                      |
| `yarn start`        | Run the production server             |
| `yarn lint`         | Lint with ESLint                      |
| `yarn typecheck`    | TypeScript type-check (no emit)       |
| `yarn format`       | Format all files with Prettier        |
| `yarn format:check` | Verify formatting                     |
| `yarn test:e2e`     | Run Playwright e2e tests              |
| `yarn test:e2e:ui`  | Run Playwright in interactive UI mode |

---

## Docker

```bash
cp .env.example .env
docker compose up --build
# open http://localhost:3000
```

The image is a multi-stage build that runs the production server via
`yarn start`. A health check is exposed at `GET /api/health`.

---

## Testing

End-to-end tests live in [`tests/e2e`](tests/e2e) and run against a built app.

```bash
yarn test:e2e        # headless (chromium + mobile viewport)
yarn test:e2e:ui     # interactive
```

Traces, screenshots, and video are captured on failure; the HTML report is
written to `playwright-report/`.

---

## CI/CD

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes and PRs to
`main`:

1. **quality** — install, `lint`, `typecheck`, `format:check`, `build`
2. **e2e** — install browsers, build, `test:e2e` (uploads the report)
3. **docker** — validates the Docker image builds

The pipeline fails if any step fails.

---

## Authentication & RBAC foundation

The auth layer is scaffolded but **not enforced** yet:

- Types & permissions — [`src/types/auth.ts`](src/types/auth.ts),
  [`src/constants/roles.ts`](src/constants/roles.ts)
- Service (ready for the backend) — [`src/features/auth/auth.service.ts`](src/features/auth/auth.service.ts)
- Placeholder store — [`src/features/auth/auth.store.ts`](src/features/auth/auth.store.ts)
- Guards (built, unused) — `RequireAuth`, `RequireRole`
- Route gate (disabled) — [`src/proxy.ts`](src/proxy.ts) (`AUTH_ENFORCED = false`)

To enable enforcement later: connect the login flow to `authService`, then flip
`AUTH_ENFORCED` to `true` in `src/proxy.ts`.

---

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for the branching strategy, commit
convention, and PR guidelines.
