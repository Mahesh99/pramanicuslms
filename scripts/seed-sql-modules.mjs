/**
 * Seeds the Oracle SQL Training course from course-notes/sql/module*.md
 * into Supabase `modules.content_md`.
 *
 * Run with: npm run seed:sql
 * (uses `node --env-file=.env.local` to load Supabase credentials)
 */
import { readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const COURSE_SLUG = "sql-training";
const COURSE_TITLE = "Oracle SQL Training";
const COURSE_DESCRIPTION =
  "3-week Oracle SQL programme — Pramanicus Academy (SQL only, no PL/SQL)";

const MODULE_META = [
  {
    slug: "module1",
    sort_order: 1,
    title: "Introduction to Oracle SQL",
    week: "Week 1",
    subtitle: "Database · DBMS · RDBMS · SQL · RDBMS Products",
    level: "Beginner",
  },
  {
    slug: "module2",
    sort_order: 2,
    title: "Basics of Oracle SQL",
    week: "Week 1",
    subtitle: "Users · Schemas · Data Modeling · Data Dictionary · Data Types",
    level: "Beginner",
  },
  {
    slug: "module3",
    sort_order: 3,
    title: "DDL & DML Commands",
    week: "Week 1",
    subtitle: "CREATE · ALTER · DROP · TRUNCATE · INSERT · UPDATE · DELETE · MERGE",
    level: "Beginner",
  },
  {
    slug: "module4",
    sort_order: 4,
    title: "Constraints & Transaction Control",
    week: "Week 2",
    subtitle: "NOT NULL · CHECK · UNIQUE · PK · FK · COMMIT · ROLLBACK · SAVEPOINT",
    level: "Beginner–Intermediate",
  },
  {
    slug: "module5",
    sort_order: 5,
    title: "Access Control & Data Retrieval",
    week: "Week 2",
    subtitle: "GRANT · REVOKE · SELECT · WHERE · ORDER BY · GROUP BY · HAVING",
    level: "Intermediate",
  },
  {
    slug: "module6",
    sort_order: 6,
    title: "SQL Operators",
    week: "Week 2",
    subtitle: "Relational · Negation · Logical · Arithmetic Operators",
    level: "Intermediate",
  },
  {
    slug: "module7",
    sort_order: 7,
    title: "Functions & Joins",
    week: "Week 3",
    subtitle: "String · Numeric · Date · Group · Analytical Functions · Joins",
    level: "Intermediate–Advanced",
  },
  {
    slug: "module8",
    sort_order: 8,
    title: "Subqueries & Set Operators",
    week: "Week 3",
    subtitle: "Subqueries · Nested Queries · UNION · INTERSECT · MINUS",
    level: "Advanced",
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Make sure .env.local is filled in, then run: npm run seed:sql",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const notesDir = path.join(process.cwd(), "course-notes", "sql");

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
