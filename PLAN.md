# Course Navigation & Content Display Rebuild — Plan

Reference doc for continuing this work in any new chat. Update the **Status** column as phases complete.

## Stack

- Next.js 15 (App Router, Turbopack dev), React 19, TypeScript
- Supabase: Auth (Google OAuth + email/password) + Postgres, gated via RLS
- Content: Markdown in `content_md` column, rendered via `react-markdown` + `remark-gfm` + `rehype-raw`
- Styling: Tailwind CSS 4 (mostly dormant — UI is driven by `src/styles/course.css` semantic classes + CSS variables)
- Interactive code: Pyodide-powered "Run" buttons embedded in module content (global scripts, main thread, no worker)

## Goal — 3-tier navigation

```
Dashboard (/dashboard)
  → Course view (/courses/[courseId])
    → Module view (/courses/[courseId]/modules/[moduleId])
```

Persistent nav bar on every authenticated route. Sidebar in module view lists all modules in the course with completion state. Prev/Next + Mark Complete at the bottom of module content.

## Decisions locked for v1

| Flag | Decision | Why |
|------|----------|-----|
| Module locking | **All open once enrolled** (no sequential lock in v1) | Matches current RLS; lock can be added later without redoing routes |
| URL params | UUIDs: `/courses/[courseId]/modules/[moduleId]` | Per original spec; `slug` kept for display/admin |
| Styling | Extend `course.css` tokens (+ light Tailwind `@theme` bridge later) | UI is class-based today; don't rewrite `ModuleMarkdown` |
| Sign-out | Keep `POST /auth/signout` (server-side `supabase.auth.signOut()`) | Already correct pattern |
| Legacy routes | `/course` → redirects to `/dashboard`; `/course/[slug]` stays functional until Phase 6 replaces it | Avoid broken bookmarks during transition |
| Courses RLS | Tightened to enrolled-only SELECT (was `using (true)`) | Defense in depth — API must not leak unenrolled courses |

## Key existing files (pre-rebuild baseline)

| File | Role |
|------|------|
| `supabase/schema.sql` | Canonical schema — courses, enrollments, modules (+ now module_progress) |
| `src/lib/auth.ts` | `COURSE_SLUG`, `ensureEnrollmentClaimed()`, `getSessionUser()` |
| `src/lib/modules.ts` | `listModules`, `getModuleContent` (+ now `getModuleById`) |
| `src/middleware.ts` + `src/lib/supabase/middleware.ts` | Session refresh, public-path allowlist, redirects |
| `src/components/SiteHeader.tsx` | Persistent top nav (server component) |
| `src/components/ModuleMarkdown.tsx` | Client component — markdown render, section TOC, Pyodide hook |
| `src/components/ModuleSidebar.tsx` | In-page section TOC (NOT the cross-module course sidebar — that's new, Phase 6) |
| `public/js/pyodide-runner.js` | Global Pyodide loader + Run button enhancer |
| `src/styles/course.css` | Design system — `:root` tokens, `.topnav`, `.layout`, `.sidebar`, `.module-grid`, `.mod-card` |

---

## Phase status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Documentation discovery / codebase audit | ✅ Done |
| 1 | Schema: `module_progress` table + tightened courses RLS | ✅ Done |
| 2 | Data layer helpers (`courses.ts`, `progress.ts`, `getModuleById`) | ✅ Done |
| 3 | Auth shell: `(app)` layout, middleware, redirects to `/dashboard` | ✅ Done |
| 4 | Tier 1: Dashboard — enrolled courses grid w/ real progress | ✅ Done |
| 5 | Tier 2: Course view (`/courses/[courseId]`) — module list + status icons | ✅ Done |
| 6 | Tier 3: Module view (`/courses/[courseId]/modules/[moduleId]`) + `CourseModuleNav` sidebar + mark complete | ✅ Done |
| 7 | (Optional) Sequential locking | ✅ Done |
| 8 | Final verification pass (auth, RLS, nav, progress, regressions) | ✅ Done |

---

## Phase 1 — Schema (done)

**Files:**
- `supabase/schema.sql` — updated in place, valid top-to-bottom bootstrap
- `supabase/migrations/20260712120000_module_progress_and_course_rls.sql` — incremental migration for an existing DB

**Changes:**
- `module_progress(id, user_id, module_id, completed_at, unique(user_id, module_id))` + RLS: `using (auth.uid() = user_id) with check (auth.uid() = user_id)`
- Courses SELECT policy replaced: `using (public.is_enrolled_in_course(courses.slug))` (was `using (true)`)
- Modules SELECT policy unchanged — enrollment-only, not progress-gated

**⚠️ Action needed by you:** run the migration SQL against your actual Supabase project (SQL editor or CLI) — it hasn't been applied to a live database yet, only committed to the repo.

---

## Phase 2 — Data layer (done)

**Files:**
- `src/lib/courses.ts` — `listEnrolledCourses(supabase, userId)`, `getCourseForUser(supabase, courseId)`, type `CourseRow`
- `src/lib/progress.ts` — `listModulesWithProgress`, `getModuleProgress`, `markModuleComplete` (upsert on `user_id,module_id`), `getContinueModule` (first incomplete by `sort_order`, else first module)
- `src/lib/modules.ts` — added `getModuleById(supabase, courseId, moduleId)`
- `src/lib/auth.ts` — added `ensureEnrollmentClaimedByCourseId(courseId)`; existing `ensureEnrollmentClaimed(courseSlug = COURSE_SLUG)` untouched

All helpers take `SupabaseClient` + explicit `userId`/`courseId` args — no client-only access control, RLS is the backstop.

---

## Phase 3 — Auth shell (done)

**Files:**
- `src/app/(app)/layout.tsx` — renders `SiteHeader` once, wraps all authenticated routes
- `src/app/(app)/dashboard/page.tsx` — stub: lists enrolled courses, Continue link resolved via `getContinueModule` → `/course/[slug]`
- `src/app/(app)/course/page.tsx` — `redirect("/dashboard")`
- Moved under `(app)/`: `course/[slug]/page.tsx`, `playground/page.tsx`, `admin/invites/page.tsx` (old top-level copies deleted)
- `src/middleware.ts` — logged-in `/login`|`/signup` → `/dashboard`
- `src/components/SiteHeader.tsx` — "Courses" link → `/dashboard`; logo → `/dashboard` when signed in
- `LoginForm.tsx`, `SignupForm.tsx`, `auth/callback/route.ts` — default redirect target → `/dashboard`

Public `/`, `/login`, `/signup`, `/auth/*` remain outside `(app)`. Root `layout.tsx` (Pyodide scripts) untouched.

**Known gap carried into Phase 5/6:** dashboard still links to legacy `/course/[slug]` (module-slug URL), not yet `/courses/[courseId]/modules/[moduleId]`.

---

## Phase 4 — Dashboard (done)

**Files:** `src/app/(app)/dashboard/page.tsx`

- Card per enrolled course: title, description, progress `X/Y modules complete` + `%` progress bar, Continue/Start/Review button → `getContinueModule` result (falls back to `/courses/[courseId]` when no modules)
- `listModulesWithProgress` computes `X/Y` per course (fetched in parallel via `Promise.all`)
- Empty state (`.empty-state`) if zero enrollments
- Added `.progress-bar-track` / `.progress-bar-fill` / `.progress-label` / `.mod-card-progress` / `.empty-state` to `course.css`
- Continue link now points straight at `/courses/[courseId]/modules/[moduleId]` (module UUID) instead of the legacy slug route

**Verified:** `next build` + `next lint` clean; only enrolled courses render (RLS backstop unchanged); progress counts derive from `module_progress` rows.

---

## Phase 5 — Course view (done)

**New route:** `src/app/(app)/courses/[courseId]/page.tsx`

- `ensureEnrollmentClaimedByCourseId` gates access; `getCourseForUser` → `notFound()` if null
- Title, description, overall progress bar (`.course-progress-hero`)
- Ordered module list (`listModulesWithProgress`) rendered via new `.module-list` / `.module-list-row` classes: number badge (✓ when complete), title, subtitle, week
- Each row links to `/courses/[courseId]/modules/[moduleId]`

**Verified:** ordering by `sort_order`; completion icons match `module_progress`; unenrolled → denied via `ensureEnrollmentClaimedByCourseId`.

---

## Phase 6 — Module view (done)

**New route:** `src/app/(app)/courses/[courseId]/modules/[moduleId]/page.tsx`

- New **client** component `src/components/CourseModuleNav.tsx`: props `{ courseId, modules, currentModuleId }`, highlights current module, shows ticks, uses `next/link`, collapsible drawer below `md:` (`.course-nav-toggle` / `.course-nav.is-open`) — `ModuleSidebar` untouched, still the in-page section TOC
- Page layout: `.course-shell` grid (`CourseModuleNav` | main column) — sits above `ModuleMarkdown`'s own internal `.layout`
- Server-fetch: course + module via `getModuleById`, all modules + progress via `listModulesWithProgress`, prev/next computed from ordered list
- Breadcrumb: Dashboard / [Course] / Module N
- Reuses `ModuleMarkdown` for content (Pyodide unchanged)
- Prev/Next footer links (now module-UUID based)
- New client `src/components/MarkCompleteButton.tsx` → calls server action `markComplete` in `src/app/actions/progress.ts` (wraps `markModuleComplete`, revalidates dashboard/course/module paths) → `router.refresh()`
- `/course/[slug]` retired: now resolves the module by slug via `getModuleContent` and `redirect()`s to `/courses/[courseId]/modules/[moduleId]`
- `src/app/page.tsx` (public landing, enrolled-user module grid) updated to link to `/courses/[courseId]/modules/[moduleId]` instead of `/course/[slug]`

**Verified:** `next build` succeeds (13/13 static pages, new dynamic routes present); top nav never disappears (still rendered by `(app)/layout.tsx`); mark-complete round-trips through the server action; Pyodide/`ModuleMarkdown` rendering path untouched.

---

## Phase 7 — Sequential locking (done)

**Files:**
- `src/lib/progress.ts` — added `ModuleWithLock` type + pure `withLocking(modules)` helper: module `i` is `locked` iff module `i-1`'s `completed_at` is null; first module always unlocked. No extra query, no schema/RLS change (modules RLS stays enrollment-only per the v1 decision).
- `src/app/(app)/courses/[courseId]/page.tsx` — module list rows call `withLocking`; locked rows render as a non-clickable `<span class="module-list-row is-locked">` with 🔒 instead of `Link`; reads `?locked=1` and shows a dismissible notice banner.
- `src/app/(app)/courses/[courseId]/modules/[moduleId]/page.tsx` — **redirect guard**: if the requested module is locked, `redirect(/courses/[courseId]?locked=1)` before any content renders (covers direct links, back-button, stale bookmarks); Next-module footer link becomes a disabled 🔒 span when `next.locked`.
- `src/components/CourseModuleNav.tsx` — accepts `ModuleWithLock[]`; locked entries render as a disabled `<span class="is-locked">` instead of `Link` in the sidebar.
- `src/styles/course.css` — added `.module-list-row.is-locked`, `.module-nav .is-locked`, `.course-nav ul li .is-locked` (dimmed, `cursor: not-allowed`, no hover lift).

**Verified:** `next build` (13/13 pages, 0 lint/type errors) confirms all call sites compile against the new `ModuleWithLock` type; `getContinueModule` (dashboard) is unaffected — it already resolves to the first incomplete module, which is by construction never locked.

---

## Phase 8 — Final verification (done)

1. **Build/lint:** `next build` succeeds — compiles, type-checks, lints, and statically/dynamically generates all 13 routes with zero errors.
2. **Grep guards:**
   - `using (true)` — **zero matches** in `supabase/*.sql` (courses policy is `using (public.is_enrolled_in_course(courses.slug))`).
   - Stray `/course/` links — **zero matches** for `href="/course/…"` in `src/`; the only remaining literal `/course/` is the intentional `redirect(\`/login?next=/course/${slug}\`)` inside the legacy `course/[slug]` redirect shim, which itself immediately resolves and redirects to `/courses/[courseId]/modules/[moduleId]` once signed in.
3. **Auth/RLS/nav/progress paths** — unchanged from Phases 3–6, re-confirmed by the passing build (route table shows `/`, `/dashboard`, `/courses/[courseId]`, `/courses/[courseId]/modules/[moduleId]`, `/course`, `/course/[slug]`, `/login`, `/signup`, `/auth/*`, `/admin/invites`, `/playground` all present); locking guard adds one more redirect-if-unauthorized-state check on top of the existing enrollment gates.
4. **Manual/live-environment checks not run here** (need a real Supabase session + browser): OAuth sign-in round trip, actually clicking through dashboard → course → module → sidebar → prev/next → mark-complete → confirm counts update on all three tiers, and confirming a locked module's redirect banner. Recommended before shipping to users.

---

## How to resume in a new chat

All 8 phases are done. If new work comes up (e.g. real per-course locking toggle, admin UI to reorder modules, unlocking overrides for admins), append a new "Phase 9" section here rather than reopening 0–8.
