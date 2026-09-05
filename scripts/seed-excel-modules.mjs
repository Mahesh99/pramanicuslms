/**
 * Seeds the Advanced Excel course from course-notes/excel/module*.md
 * into Supabase `modules.content_md`.
 *
 * Run with: npm run seed:excel
 * (uses `node --env-file=.env.local` to load Supabase credentials)
 */
import { readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const COURSE_SLUG = "excel-training";
const COURSE_TITLE = "Advanced Excel";
const COURSE_DESCRIPTION =
  "Hands-on Advanced Excel — functions, lookups, PivotTables, cleaning, formatting, charts, macros, validation, and basic statistics. Pramanicus Academy.";

const MODULE_META = [
  {
    slug: "module1",
    sort_order: 1,
    title: "Basic functions",
    week: "Week 1",
    subtitle: "SUM · AVERAGE · MIN · MAX · COUNT · COUNTIF",
    level: "Beginner",
  },
  {
    slug: "module2",
    sort_order: 2,
    title: "Lookup functions",
    week: "Week 1",
    subtitle: "VLOOKUP · HLOOKUP · XLOOKUP",
    level: "Beginner–Intermediate",
  },
  {
    slug: "module3",
    sort_order: 3,
    title: "Pivot tables",
    week: "Week 1",
    subtitle: "PivotTables · formatting · slicers",
    level: "Intermediate",
  },
  {
    slug: "module4",
    sort_order: 4,
    title: "Data cleaning and transformation",
    week: "Week 2",
    subtitle: "Duplicates · sort/filter · LEFT · RIGHT · MID · CONCATENATE",
    level: "Intermediate",
  },
  {
    slug: "module5",
    sort_order: 5,
    title: "Conditional formatting",
    week: "Week 2",
    subtitle: "Colors · data bars · icon sets",
    level: "Intermediate",
  },
  {
    slug: "module6",
    sort_order: 6,
    title: "Charts and graphs",
    week: "Week 2",
    subtitle: "Bar · line · pie · scatter",
    level: "Intermediate",
  },
  {
    slug: "module7",
    sort_order: 7,
    title: "Macros",
    week: "Week 3",
    subtitle: "Record · run · simple VBA",
    level: "Intermediate–Advanced",
  },
  {
    slug: "module8",
    sort_order: 8,
    title: "Data validation",
    week: "Week 3",
    subtitle: "Drop-down lists · custom rules",
    level: "Intermediate",
  },
  {
    slug: "module9",
    sort_order: 9,
    title: "Statistical analysis",
    week: "Week 3",
    subtitle: "STDEV · CORREL · Regression · ANOVA",
    level: "Advanced",
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Make sure .env.local is filled in, then run: npm run seed:excel",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const notesDir = path.join(process.cwd(), "course-notes", "excel");

async function ensureCourse() {
  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("courses")
    .insert({ slug: COURSE_SLUG, title: COURSE_TITLE, description: COURSE_DESCRIPTION })
    .select("id")
    .single();

  if (error || !created) {
    console.error("Failed to create course:", error?.message);
    process.exit(1);
  }

  console.log(`Created course "${COURSE_SLUG}" (${created.id})`);
  return created.id;
}

async function main() {
  const courseId = await ensureCourse();

  for (const meta of MODULE_META) {
    const file = path.join(notesDir, `${meta.slug}.md`);
    let markdown;
    try {
      markdown = readFileSync(file, "utf8").trim();
    } catch {
      console.warn(`Skip ${meta.slug}: file not found at ${file}`);
      continue;
    }

    const { error } = await supabase.from("modules").upsert(
      {
        course_id: courseId,
        slug: meta.slug,
        title: meta.title,
        subtitle: meta.subtitle,
        week: meta.week,
        level: meta.level,
        sort_order: meta.sort_order,
        content_md: markdown,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "course_id,slug" },
    );

    if (error) {
      console.error(`Failed to upsert ${meta.slug}:`, error.message);
    } else {
      console.log(`Seeded ${meta.slug} (${markdown.length} chars of markdown)`);
    }
  }

  console.log("Done.");
}

main();
