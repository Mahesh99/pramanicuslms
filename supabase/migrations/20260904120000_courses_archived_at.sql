-- Soft-archive courses: hide from students and invite pickers; keep enrollments.
-- Also ensures auth_email() exists (needed by enrollment RLS / checks).

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

grant execute on function public.auth_email() to authenticated;

alter table public.courses
  add column if not exists archived_at timestamptz;

create index if not exists courses_archived_at_idx
  on public.courses (archived_at)
  where archived_at is null;

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
      and c.archived_at is null
      and (
        e.user_id = auth.uid()
        or (
          public.auth_email() <> ''
          and lower(e.email) = public.auth_email()
        )
      )
  );
$$;

grant execute on function public.is_enrolled_in_course(text) to authenticated;
