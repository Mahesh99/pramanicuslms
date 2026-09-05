# Advanced Excel Implementation Plan

> **For agentic workers:** Implement phase by phase. Steps use checkbox syntax.

**Goal:** Ship Advanced Excel as a seeded LMS course with notes and CSV datasets.

**Architecture:** Markdown in `course-notes/excel/`, static CSVs in `public/excel/`, course row via migration, content via seed script copied from `scripts/seed-sql-modules.mjs`.

**Tech Stack:** Markdown (SQL module format), Node seed script, Supabase `courses` + `modules`.

## Global Constraints

- Slug `excel-training`; title `Advanced Excel`
- Parser format: emoji, `Section X.Y`, `##` heading
- Datasets under `public/excel/`
- Macros notes are record/run + simple VBA only

---

### Phase 1: Datasets, seed path, Modules 1–3

- [ ] Generate CSVs via `scripts/generate-excel-datasets.mjs`
- [ ] `supabase migration new excel-training-course` then insert course row
- [ ] Add `scripts/seed-excel-modules.mjs` and `seed:excel` npm script
- [ ] Write `course-notes/excel/module1.md` … `module3.md`

**Verify:** files exist; generator is deterministic; seed script lists 9 module slugs.

### Phase 2: Modules 4–6

- [ ] Write module4 (cleaning), module5 (conditional formatting), module6 (charts)
- [ ] Examples use `dirty_staff.csv` and `sales.csv`

### Phase 3: Modules 7–9, seed, verify

- [ ] Write module7–9
- [ ] Run `node --check` on seed/generator
- [ ] Parse all modules with existing `parseModuleMarkdown` (small node/ts check or lint)
- [ ] Run `npm run seed:excel` if `.env.local` has credentials

---
