-- Add Oracle SQL Training course (run on existing Supabase projects)

insert into public.courses (slug, title, description)
values (
  'sql-training',
  'Oracle SQL Training',
  '3-week Oracle SQL programme — Pramanicus Academy (SQL only, no PL/SQL)'
)
on conflict (slug) do nothing;

-- Module content is seeded via: npm run seed:sql
