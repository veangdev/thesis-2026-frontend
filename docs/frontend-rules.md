# Frontend Project Setup Requirements

Act as a senior Frontend Engineer with more than 10 years of professional experience. Prepare this frontend project to a production-quality, maintainable, scalable, and team-ready standard before it is pushed to GitHub and before other developers are invited to collaborate.

The immediate goal is to build and display a landing page that will temporarily serve as the dashboard. Authentication and role-based access control must be prepared as a foundation, but they must not be actively enforced until the backend API is ready.

## Required Technology Stack

Use the following stack:

- Next.js with App Router
- TypeScript
- Tailwind CSS v4
- Yarn only as the package manager
- shadcn/ui
- Docker and Docker Compose
- Playwright for end-to-end testing
- ESLint and Prettier
- Husky and lint-staged
- GitHub Actions for CI/CD

Do not use npm or pnpm.

---

## 1. Frontend Foundation

Create a complete frontend foundation that is ready for building production UI.

Requirements:

- Use a clean, scalable, modular architecture.
- Keep all working application source code inside the `src` directory.
- Use the Next.js App Router structure.
- Separate public pages, protected pages, layouts, components, hooks, services, types, constants, utilities, and configuration.
- Avoid duplicated, unnecessary, or overly complex code.
- Use meaningful file names and consistent naming conventions.

Recommended structure:

```text
src/
├── app/
│   ├── (public)/
│   ├── (dashboard)/
│   ├── api/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── shared/
│   ├── layouts/
│   └── features/
├── config/
├── constants/
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
└── utils/
```

---

## 2. Core Frontend Setup

Configure the core frontend features needed for a real application.

Requirements:

- Configure environment variables using `.env` files.
- Provide a complete `.env.example` file.
- Use a central configuration module for environment variables.
- Configure API base URLs through environment variables.
- Add a typed API client that is ready to communicate with the backend.
- Handle API errors consistently.
- Support request headers, authentication tokens, query parameters, and request cancellation where appropriate.
- Do not hard-code API URLs inside components.

Example environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

---

## 3. TypeScript and Build Quality

The project must have zero TypeScript, linting, and compilation errors.

Requirements:

- Enable strict TypeScript configuration where appropriate.
- Avoid `any` unless there is a valid documented reason.
- Ensure `yarn build` completes successfully.
- Ensure all TypeScript errors are fixed before the project is considered complete.
- Ensure all ESLint warnings and errors are resolved.
- Ensure there are no unused imports, unused variables, or dead code.

Required commands:

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn typecheck
yarn format
yarn format:check
yarn test:e2e
```

---

## 4. Tailwind CSS v4 Configuration

Configure Tailwind CSS v4 correctly.

Requirements:

- Use Tailwind CSS v4.
- Configure global styles cleanly.
- Prevent conflicts between Tailwind utility classes and custom styles in `globals.css`.
- Avoid unnecessary custom CSS when Tailwind utilities are sufficient.
- Keep global CSS minimal and limited to global tokens, base styles, fonts, and CSS variables.
- Ensure there are zero CSS warnings and errors.
- Use a consistent design-token approach for colors, spacing, typography, borders, shadows, and radius.

---

## 5. shadcn/ui Setup

Install and configure shadcn/ui correctly.

Requirements:

- Configure shadcn/ui with Tailwind CSS v4.
- Install the essential components needed to build a modern dashboard and landing page.

Install at least:

- Button
- Input
- Label
- Card
- Dialog
- Dropdown Menu
- Sheet
- Tabs
- Tooltip
- Avatar
- Badge
- Separator
- Skeleton
- Table
- Select
- Textarea
- Form
- Sonner / Toast
- Alert Dialog
- Popover
- Command
- Pagination

Rules:

- Keep generated shadcn/ui components inside `src/components/ui`.
- Do not modify generated components unless necessary.
- Build custom reusable components in `src/components/shared`.
- Build feature-specific components in `src/components/features`.

---

## 6. Component Architecture

Implement a clean component strategy.

Requirements:

- Create reusable shared components.
- Create feature-specific components that are isolated by domain.
- Keep page components focused on composition and routing.
- Avoid placing complex business logic directly inside page files.
- Use server components by default.
- Use client components only when required for state, effects, event handlers, browser APIs, or interactive UI.
- Add `"use client"` only where necessary.

Create the following reusable UI states:

```text
src/components/shared/
├── empty-state.tsx
├── loading-overlay.tsx
├── page-skeleton.tsx
├── coming-soon.tsx
├── error-state.tsx
└── confirm-dialog.tsx
```

Required shared components:

- Loading Overlay
- Empty State
- Skeleton Loading
- Error State
- Coming Soon Component
- Confirmation Dialog
- Page Header
- Data Table Wrapper
- Pagination Wrapper
- Application Logo
- Theme Provider, if dark mode is included

---

## 7. State, Hooks, and Constants Management

Use clean state management practices.

Requirements:

- Use React state for local component state.
- Use custom hooks for reusable client-side logic.
- Use a lightweight global state solution only when global state is truly needed.
- Avoid putting all application state into one global store.
- Keep API server state separate from UI state.
- Use constants for fixed values, route names, API paths, roles, permissions, and configuration values.
- Avoid magic strings and duplicated constants.

Recommended directories:

```text
src/
├── constants/
│   ├── api.ts
│   ├── routes.ts
│   ├── roles.ts
│   └── app.ts
├── hooks/
│   ├── use-debounce.ts
│   ├── use-disclosure.ts
│   └── use-media-query.ts
├── stores/
│   └── ui-store.ts
└── types/
    ├── api.ts
    ├── auth.ts
    └── common.ts
```

---

## 8. Authentication and Role-Based Access Control Foundation

Prepare authentication and role-based access control architecture, but do not actively enforce it yet.

The landing page must remain publicly accessible and act as the temporary dashboard page until the backend is ready.

Requirements:

- Create authentication types and interfaces.
- Create user, session, role, and permission types.
- Create an authentication service layer that is ready to call backend endpoints later.
- Create an API client interceptor or middleware strategy for attaching access tokens.
- Create a placeholder authentication store or context.
- Create route protection utilities or middleware structure, but do not enable protection yet.
- Create role and permission constants.
- Prepare components such as `RequireAuth`, `RequireRole`, or route guards, but do not use them on the landing page yet.
- Do not implement fake authentication logic that could be confused with real security.

Suggested structure:

```text
src/
├── features/
│   └── auth/
│       ├── auth.service.ts
│       ├── auth.types.ts
│       ├── auth.store.ts
│       ├── auth.constants.ts
│       ├── require-auth.tsx
│       └── require-role.tsx
├── middleware.ts
└── lib/
    └── auth.ts
```

---

## 9. Docker Setup

The project must run successfully through Docker.

Requirements:

- Create a production-ready multi-stage `Dockerfile`.
- Create `docker-compose.yml`.
- Use environment variables correctly inside Docker.
- Ensure the application can be started on another developer’s computer with minimal commands.
- Ensure the Docker build succeeds without errors.
- Ensure the production container runs using `yarn start`.
- Add `.dockerignore` to reduce image size and avoid copying unnecessary files.

Expected setup commands:

```bash
cp .env.example .env
docker compose up --build
```

The application should be accessible after Docker starts.

---

## 10. Testing with Playwright

Configure Playwright for end-to-end testing.

Requirements:

- Install and configure Playwright.
- Add tests for the landing/dashboard page.
- Test important user interactions.
- Test page loading, navigation, responsive layout, empty states, loading states, and error states where applicable.
- Ensure tests can run in CI.
- Add screenshots or traces on test failures.
- Add a test command:

```bash
yarn test:e2e
```

Also add:

```bash
yarn test:e2e:ui
```

for local development if appropriate.

---

## 11. Code Quality and Git Hooks

Configure code quality tools.

Requirements:

- Configure ESLint.
- Configure Prettier.
- Configure Husky.
- Configure lint-staged.
- Run formatting and linting checks before commits.
- Prevent commits when critical checks fail.
- Add a consistent import order strategy if needed.
- Ensure the repository contains no unnecessary files, generated files, secrets, or environment files.

Pre-commit checks should include:

```bash
yarn lint
yarn typecheck
yarn format:check
```

---

## 12. GitHub Collaboration Readiness

Before the first GitHub push, include:

- `README.md`
- `.gitignore`
- `.dockerignore`
- `.env.example`
- `Dockerfile`
- `docker-compose.yml`
- ESLint configuration
- Prettier configuration
- Husky configuration
- Playwright configuration
- GitHub Actions workflow
- Clear project architecture documentation
- Installation instructions
- Docker instructions
- Environment variable instructions
- Development commands
- Testing instructions
- Build instructions
- CI/CD instructions
- Branching strategy
- Pull request guidelines
- Commit message convention

---

## 13. CI/CD Readiness

Create a GitHub Actions workflow that runs on pull requests and pushes to the `main` branch.

The CI pipeline must run:

```bash
yarn install --frozen-lockfile
yarn lint
yarn typecheck
yarn format:check
yarn build
yarn test:e2e
```

The pipeline must fail if any linting, formatting, TypeScript, build, or Playwright test step fails.

Use Docker build validation in CI if possible.

---

## 14. Initial Page Requirement

For now, implement a polished landing page that temporarily acts as the dashboard page.

Requirements:

- The page must be publicly accessible.
- Do not require login yet.
- Use reusable components and shadcn/ui.
- Include responsive desktop, tablet, and mobile layouts.
- Include loading, empty, error, and coming soon states where relevant.
- Keep the page structure ready for future authenticated dashboard content.
- Do not spend time implementing real authentication UI until the backend API is ready.

---

## Final Verification Checklist

Before marking the project as complete, verify and report the result of every item below:

- [ ] Next.js App Router is configured.
- [ ] TypeScript is configured with strict settings.
- [ ] Tailwind CSS v4 is configured correctly.
- [ ] All application code is inside `src`.
- [ ] shadcn/ui is installed and essential components are available.
- [ ] API client is configured through environment variables.
- [ ] `.env.example` is complete.
- [ ] Authentication foundation is prepared.
- [ ] Role-based access control foundation is prepared.
- [ ] Landing/dashboard page is publicly accessible.
- [ ] Shared components are implemented.
- [ ] Loading Overlay is implemented.
- [ ] Empty State is implemented.
- [ ] Skeleton Loading is implemented.
- [ ] Error State is implemented.
- [ ] Coming Soon component is implemented.
- [ ] Docker build succeeds.
- [ ] Docker Compose runs successfully.
- [ ] Yarn is the only package manager used.
- [ ] `yarn lint` passes.
- [ ] `yarn typecheck` passes.
- [ ] `yarn format:check` passes.
- [ ] `yarn build` passes.
- [ ] Playwright is configured.
- [ ] Playwright tests pass.
- [ ] Git hooks are configured.
- [ ] GitHub Actions CI workflow is configured.
- [ ] README documentation is complete.
- [ ] No TypeScript errors remain.
- [ ] No compile errors remain.
- [ ] No unnecessary, duplicated, or messy code remains.

Do not mark the project as complete until every checklist item has been verified.
