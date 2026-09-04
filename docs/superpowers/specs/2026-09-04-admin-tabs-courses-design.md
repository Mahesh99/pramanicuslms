# Admin tabs + course archive + nav latency

## Goals
1. Faster site nav (esp. Courses / dashboard) — fix first.
2. Admin with three tabs: Invite | Users | Courses.
3. Users list → user detail to add/remove courses.
4. Courses tab: create (auto-slug), edit title/description, archive/restore.
5. Modules out of scope.

## Routing
- `/admin` — Invite + create account
- `/admin/users` — user list
- `/admin/users/[email]` — enrollments, add course, reset password, revoke
- `/admin/courses` — list/create/edit/archive
- Shared `AdminTabs` nav; `/admin/invites` redirects to `/admin`

## Data
- `courses.archived_at timestamptz null`
- Archive hides from student dashboard + invite/add pickers; keeps enrollments; blocks direct access via `is_enrolled_in_course` requiring `archived_at is null`
- Slug auto from title; collision suffix `-2`, `-3`; not editable in v1

## Perf
- `ensureAnyEnrollmentClaimed`: claim only when not already enrolled (skip for admins)
- Deduplicate auth with React `cache()` on session helpers
- Admin pages load only their own data

## Out of scope
- Module CRUD
- Editable slugs
- Hard-delete courses
