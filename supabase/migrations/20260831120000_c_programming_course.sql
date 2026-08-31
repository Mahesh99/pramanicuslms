-- Add C Programming course (run on existing Supabase projects)

insert into public.courses (slug, title, description)
values (
  'c-training',
  'C Programming',
  'C programming programme — Pramanicus Academy'
)
on conflict (slug) do nothing;

-- Module content is seeded via: npm run seed:c
