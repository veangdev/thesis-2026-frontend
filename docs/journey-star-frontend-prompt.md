# Claude Code Prompt — Journey Star FRONTEND (Repo 2 of 2)

> **How to use:** Run this in your frontend repository. A matching backend prompt exists for the other repo (NestJS + PostgreSQL). This app consumes that API — the contract in §3 must match exactly. If the backend isn't running yet, the app must still work in mock mode (§4).

---

## 1. Role & Objective

You are a senior frontend engineer and product designer. Build the web client for **PNC Students' Journey Star System** — a premium, desktop-first SaaS platform tracking student growth from enrollment to employment ("From First Day at PNC to First Day of Employment"). It replaces the school's use of Outcomes Star with a modern in-house alternative.

## 2. Tech Stack (use exactly this)

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS with custom design tokens (§5)
- **Routing:** React Router v6 with role-based route guards
- **Server state:** TanStack Query (React Query) for all API data — caching, loading, and error states come from it
- **Client state:** Zustand (auth session, UI state)
- **HTTP:** Axios instance with `VITE_API_BASE_URL` (default `http://localhost:3000/api/v1`), JWT attached from storage, automatic refresh-token retry on 401
- **Charts:** Recharts (radar charts are the centerpiece) · **Icons:** lucide-react
- **Fonts:** DM Sans (headings), Inter (body), JetBrains Mono (data) via Google Fonts

## 3. API Contract (backend implements exactly this — build a typed client for it)

Auth: `POST /auth/login` → `{ accessToken, refreshToken, user }`, `POST /auth/refresh`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `GET /auth/me`.

Resources (all under `/api/v1`): `/users` (+`/users/:id`, `/users/bulk`), `/cohorts` (+`/cohorts/:id`, `/cohorts/:id/dimensions`, `/cohorts/:id/periods`), `/dimensions/:id`, `/periods/:id`, `/assignments`, `/facilitators/:id/students`, `/assessments` (+`/:id`, `/:id/self`, `/:id/self/submit`, `/:id/mentor`, `/:id/mentor/submit`), `/analytics/student/:id`, `/analytics/cohort/:id`, `/analytics/overview`, `/analytics/gap/:assessmentId`, `/coaching-sessions` (+`/:id`, `/:id/action-items`), `/action-items/:id`, `/goals` (+`/:id`), `/notifications` (+`/:id/read`, `/read-all`), `/audit-logs`.

List envelope: `{ data: [...], meta: { page, pageSize, total } }`.

**Key domain rules the UI must respect:**

- Roles: `program_coordinator` (label: Program Coordinator), `facilitator` (Facilitator/Mentor), `self_assessor` (Self-Assessor/Student).
- **Scoring scale is configurable per cohort** — `cohort.scoringScaleMax` is 5 (default) or 10. Every scoring input, chart axis, gap calc, and growth-zone band must derive from it. Never hard-code 5.
- **Assessment periods are dynamic** — any number, any dates; created by coordinators.
- Assessment statuses: `draft` → `self_submitted` → `mentor_review` → `agreed` → `completed`.
- Growth zones: Red = Struggling, Yellow = Developing, Green = Thriving (thresholds proportional to scale max).
- Coaching scopes: `individual`, `group`, `class`, `batch`.

## 4. Mock Mode (required)

Create `/src/mocks` implementing the same typed service interfaces with realistic seeded data (3 cohorts, 30 students, 6 mentors, 8 dimensions, 3–4 completed cycles including improving/stagnant/regressing students). A `VITE_USE_MOCKS=true` env flag switches the app to mocks so the frontend is fully demoable without the backend. The real and mock services must share one interface so no component code changes between modes.

## 5. Design System

Feel: **Stripe Dashboard × Linear × Notion** — clean, spacious, data-rich, never cluttered. Professional, motivational, growth-oriented EdTech. Star, radar, and achievement motifs are the brand identity.

**Colors** — Primary `#1E3A8A` navy · Secondary `#F59E0B` gold · Accent `#10B981` emerald · Danger `#EF4444` · Background `#F8FAFC` · Surface `#FFFFFF` · Border `#E2E8F0` · Text `#0F172A` / `#64748B`.

**Components** — 8px spacing base; radius: cards 16px, inputs 12px, badges 8px; soft layered shadows; subtle gradients; glassmorphism only in hero/banner sections.

**Layout** — Desktop-first (≥1280px), tablet adaptive, mobile secondary. App shell: fixed role-aware sidebar + sticky top bar (logo, dynamic page title, global search, notifications dropdown, avatar menu) + wide multi-column grids. Accessibility: WCAG AA contrast, keyboard focus styles.

## 6. Screens (23)

**Public/Auth:** Landing page (hero "Track Student Transformation from Learning to Employment", features, how-it-works, growth timeline, testimonials, stats, CTAs "Start Assessment" / "Explore Dashboard", footer) · Login (split-screen: left branding + Journey Star illustration + blue/gold gradient + quote "Your growth journey starts here."; right clean form) · Forgot/Reset Password.

**Program Coordinator portal:** Dashboard (KPI cards, cohort heatmap, weakest dimensions, activity trends, activity feed, mentor workload, quick actions) · User Management (searchable tables, cohort management, profile drawers, bulk actions, mentor↔student assignment) · Reports & Analytics (growth lines, cohort radars, heatmaps, at-risk indicators, mentor effectiveness, participation, export) · Teams (drag-and-drop assignment, capacity indicators, auto-assign) · Settings (period configuration, **dimensions management**, **scoring scale config**, notification rules, permissions, audit log, branding) · Assessments Overview (periods table, completion tracking, drill-down).

**Facilitator portal:** Dashboard (assigned students, pending assessments, priority alerts, coaching schedule, comparison chart; badges Pending / Ready for Review / Coaching Needed / Completed) · Assessment Workflow (side-by-side: student self-scores read-only ← → mentor scoring, per-dimension discussion notes, gap indicators, coaching tags, **final agreed score**, multi-step submit) · Reports · Teams (own roster) · Settings & Profile (availability calendar, expertise tags).

**Self-Assessor portal:** Dashboard (welcome hero, journey progress bar, interactive radar, growth trends, goals, coaching reminders, mentor feedback highlights, badges, timeline — motivational tone) · Self-Assessment (multi-step: score each dimension via star rating/slider respecting scale, reflection textarea, draft save, review step, success animation) · Reports (history, trends, self vs mentor, downloadable report) · Profile.

**Shared:** Journey Star Visualization (full-page radar, historical overlays, cycle comparison, self-vs-mentor overlay, growth-zone bands, filters, export) · Gap Analysis · Coaching Sessions (calendar, timeline, detail modals, action items, follow-ups, scope selection) · Goals & Growth · Notifications Center (categorized, filters, mark read) · 404.

## 7. Quality Requirements

- Loading skeletons and polished empty states on every data view (React Query states).
- Graceful API error handling (toast + retry), session expiry → redirect to login.
- Motivational microcopy in the student experience.
- Switching a cohort's scale (5 ↔ 10) must visibly change all scoring UIs and chart axes.
- Smooth micro-interactions; submit success animation.

## 8. Build Order

1. Scaffold, Tailwind tokens, fonts, Axios client + auth flow (login, refresh, guards), app shell.
2. Typed API service layer + mock mode toggle.
3. Landing + auth screens.
4. Student portal → 5. Mentor portal → 6. Coordinator portal → 7. Shared screens → 8. Polish (skeletons, empty states, animations, tablet pass).

README: setup, env vars (`VITE_API_BASE_URL`, `VITE_USE_MOCKS`), run instructions, demo credentials (`coordinator@pnc.edu` / `facilitator@pnc.edu` / `student@pnc.edu`, `Password123!`).
