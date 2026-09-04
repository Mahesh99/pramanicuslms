# Admin Tabs + Courses + Latency Implementation Plan

> Executed inline 2026-09-04.

**Goal:** Speed up Courses nav, then ship Admin Invite / Users / Courses tabs with user detail and course archive.

## Status
- [x] Task 1: Perf — auth claim + cache
- [x] Task 2: Migration `archived_at`
- [x] Task 3: Courses lib + actions
- [x] Task 4: Admin shell + Invite / Users / detail / Courses pages
- [x] Task 5: Wire archive + tsc

## Remaining (manual)
- Apply `supabase/migrations/20260904120000_courses_archived_at.sql` on the remote Supabase project
