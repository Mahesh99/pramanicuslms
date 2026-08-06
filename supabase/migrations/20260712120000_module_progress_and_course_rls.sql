-- Phase 1: module_progress + tighten courses SELECT to enrolled users only.
-- Course reads require enrollment (defense in depth with app checks).

drop policy if exists "Authenticated users can read courses" on public.courses;
drop policy if exists "Enrolled users can read courses" on public.courses;
create policy "Enrolled users can read courses"
  on public.courses
  for select
  to authenticated
  using (public.is_enrolled_in_course(courses.slug));

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  completed_at timestamptz,
  unique (user_id, module_id)
);

create index if not exists module_progress_user_id_idx on public.module_progress (user_id);
create index if not exists module_progress_module_id_idx on public.module_progress (module_id);

alter table public.module_progress enable row level security;

drop policy if exists "Users manage their own progress" on public.module_progress;
create policy "Users manage their own progress"
  on public.module_progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
