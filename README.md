# Pramanicus LMS — Python Training

Authenticated course notes for **Pramanicus Academy** (Ramanthapur, Hyderabad).

Students sign in with **Google** or **email/password**. Only invited emails can open modules.

## Stack

- Next.js (App Router)
- Supabase Auth + Postgres (invites / enrollments)
- Module content converted from the original HTML notes (interactive Run buttons kept)

## Setup

### 1. Install

```bash
npm install
```

### 2. Supabase project

1. Create a free project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql)
3. **Authentication → Providers**
   - Enable **Email** (email + password)
   - Enable **Google** and add your Google OAuth client ID/secret
4. **Authentication → URL configuration**
   - Site URL: `http://localhost:3000` (and your production URL later)
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Environment

Copy `.env.example` to `.env.local` and fill in values from Supabase **Project Settings → API**:

```bash
cp .env.example .env.local
```

Set `ADMIN_EMAILS` to your own login email(s).

### 4. Seed module content into Supabase

Module content lives in the `modules` table (`content_md` column), not in files —
adding a new course later is just new database rows, never new files.

```bash
npm run seed:modules
```

This reads `legacy/module*.html`, converts each to Markdown, and upserts it into
`modules.content_md` for the `python-training` course. Re-run anytime you edit
the legacy HTML to refresh the stored Markdown. To edit content going forward,
update the `content_md` value directly in Supabase (Table Editor or SQL) —
no redeploy needed.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Invite flow

1. Sign in with an admin email listed in `ADMIN_EMAILS`
2. Open **Invites** (`/admin/invites`)
3. Add a student email
4. Student signs up / signs in with that same email (Google or password)
5. Modules unlock automatically

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run seed:modules` | Convert `legacy/` HTML → Markdown, upsert into Supabase |

Original static HTML lives in [`legacy/`](legacy/) for reference.

## Adding another course later

No new files needed:

1. Insert a row into `courses` (new `slug`, e.g. `js-training`)
2. Insert rows into `modules` with `course_id` pointing at that course, and
   `content_md` holding the lesson Markdown
3. Invite students into `enrollments` for that `course_id`

The same pages/components serve any course's content — only the database rows
change.
