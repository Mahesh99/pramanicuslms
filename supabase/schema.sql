-- Pramanicus LMS schema (run in Supabase SQL editor)

create extension if not exists "pgcrypto";

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  email text not null,
  user_id uuid references auth.users (id) on delete set null,
  invited_by uuid references auth.users (id) on delete set null,
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  unique (course_id, email)
);

create index if not exists enrollments_email_idx on public.enrollments (lower(email));
create index if not exists enrollments_user_id_idx on public.enrollments (user_id);

-- One row per lesson page. Content lives here as Markdown — adding a new
-- course/module never requires creating new files, only new rows.
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  slug text not null,
  title text not null,
  subtitle text,
  week text,
  level text,
  sort_order int not null default 0,
  content_md text not null default '',
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);

create index if not exists modules_course_id_idx on public.modules (course_id, sort_order);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  completed_at timestamptz,
  unique (user_id, module_id)
);

create index if not exists module_progress_user_id_idx on public.module_progress (user_id);
create index if not exists module_progress_module_id_idx on public.module_progress (module_id);

insert into public.courses (slug, title, description)
values (
  'python-training',
  'Python Training',
  '4-week Python programme — Pramanicus Academy'
)
on conflict (slug) do nothing;

insert into public.courses (slug, title, description)
values (
  'sql-training',
  'Oracle SQL Training',
  '3-week Oracle SQL programme — Pramanicus Academy (SQL only, no PL/SQL)'
)
on conflict (slug) do nothing;

insert into public.courses (slug, title, description)
values (
  'c-training',
  'C Programming',
  'C programming programme — Pramanicus Academy'
)
on conflict (slug) do nothing;

alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.modules enable row level security;
alter table public.module_progress enable row level security;

drop policy if exists "Users can read own enrollments" on public.enrollments;
create policy "Users can read own enrollments"
  on public.enrollments
  for select
  to authenticated
  using (
    user_id = auth.uid()
    or (
      public.auth_email() <> ''
      and lower(email) = public.auth_email()
    )
  );

drop policy if exists "Users can claim matching enrollment" on public.enrollments;
create policy "Users can claim matching enrollment"
  on public.enrollments
  for update
  to authenticated
  using (
    public.auth_email() <> ''
    and lower(email) = public.auth_email()
  )
  with check (
    public.auth_email() <> ''
    and lower(email) = public.auth_email()
    and (user_id is null or user_id = auth.uid())
  );

create or replace function public.auth_email()
returns text
language sql
stable
security definer
set search_path = public, auth
as $$
  select lower(coalesce(
    nullif(auth.jwt() ->> 'email', ''),
    (select lower(u.email) from auth.users u where u.id = auth.uid()),
    ''
  ));
$$;

create or replace function public.is_enrolled_in_course(p_course_slug text)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.enrollments e
    join public.courses c on c.id = e.course_id
    where c.slug = p_course_slug
      and (
        e.user_id = auth.uid()
        or (
          public.auth_email() <> ''
          and lower(e.email) = public.auth_email()
        )
      )
  );
$$;

grant execute on function public.auth_email() to authenticated;
grant execute on function public.is_enrolled_in_course(text) to authenticated;

-- Course reads require enrollment (defense in depth with app checks).
drop policy if exists "Authenticated users can read courses" on public.courses;
drop policy if exists "Enrolled users can read courses" on public.courses;
create policy "Enrolled users can read courses"
  on public.courses
  for select
  to authenticated
  using (public.is_enrolled_in_course(courses.slug));

-- Module content is only readable by users enrolled in that module's course.
drop policy if exists "Enrolled users can read modules" on public.modules;
create policy "Enrolled users can read modules"
  on public.modules
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.courses c
      where c.id = modules.course_id
        and public.is_enrolled_in_course(c.slug)
    )
  );

drop policy if exists "Users manage their own progress" on public.module_progress;
create policy "Users manage their own progress"
  on public.module_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
