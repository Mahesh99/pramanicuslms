-- Add Advanced Excel course (run on existing Supabase projects)

insert into public.courses (slug, title, description)
values (
  'excel-training',
  'Advanced Excel',
  'Hands-on Advanced Excel — functions, lookups, PivotTables, cleaning, formatting, charts, macros, validation, and basic statistics. Pramanicus Academy.'
)
on conflict (slug) do nothing;

-- Module content is seeded via: npm run seed:excel
