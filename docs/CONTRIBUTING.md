# Contributing

Thanks for contributing to the PNC Journey Star frontend. This guide covers our
workflow, conventions, and quality gates.

## Prerequisites

- Node.js ≥ 20.9
- **Yarn 1.x only** — do not use `npm` or `pnpm` (a single lockfile keeps
  installs reproducible).

```bash
yarn install
cp .env.example .env.local
yarn dev
```

## Branching strategy

We use a lightweight trunk-based flow off `main`:

- `main` — always releasable; protected. No direct pushes.
- Feature branches — branch from `main`, open a PR back into it.

Branch naming: `<type>/<short-description>`

| Prefix      | Use for                         | Example                    |
| ----------- | ------------------------------- | -------------------------- |
| `feat/`     | New feature                     | `feat/journey-star-radar`  |
| `fix/`      | Bug fix                         | `fix/sidebar-active-state` |
| `chore/`    | Tooling / deps / config         | `chore/bump-playwright`    |
| `refactor/` | Code change, no behavior change | `refactor/api-client`      |
| `docs/`     | Documentation only              | `docs/readme-docker`       |
| `test/`     | Tests only                      | `test/landing-responsive`  |

## Commit message convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

[optional body]
[optional footer]
```

Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `style`,
`perf`, `ci`, `build`.

Examples:

```
feat(dashboard): add KPI summary cards
fix(auth): clear tokens on logout failure
chore(deps): upgrade next to 16.2.6
```

## Code quality gates

A Husky `pre-commit` hook runs automatically:

1. `lint-staged` — ESLint `--fix` + Prettier `--write` on staged files
2. `yarn typecheck` — full TypeScript check

Before opening a PR, make sure all of these pass locally (also enforced in CI):

```bash
yarn lint
yarn typecheck
yarn format:check
yarn build
yarn test:e2e
```

## Coding conventions

- Keep all application code under `src/`.
- **Server Components by default**; add `"use client"` only when you need state,
  effects, event handlers, or browser APIs.
- Keep pages focused on composition; put logic in `hooks/`, `services/`, or
  `features/`.
- No hard-coded API URLs or magic strings — use `constants/` and `config/env`.
- Reuse the shared UI states (`EmptyState`, `ErrorState`, `LoadingOverlay`,
  `PageSkeleton`, `ComingSoon`) instead of re-implementing them.
- Don't edit generated files in `src/components/ui/` unless necessary.
- Avoid `any`; if unavoidable, document why.

## Pull request guidelines

- Keep PRs focused and reasonably small.
- Fill in **what** changed and **why**; link related issues.
- Include screenshots / recordings for UI changes.
- Ensure CI is green (lint, types, format, build, e2e, Docker build).
- At least one approving review before merge; prefer **squash merge** so `main`
  history stays clean and Conventional-Commit friendly.
