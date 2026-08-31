/**
 * Seeds the C Programming course from course-notes/c/*.md
 * into Supabase `modules.content_md`.
 *
 * Run with: npm run seed:c
 * (uses `node --env-file=.env.local` to load Supabase credentials)
 */
import { readFileSync } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const COURSE_SLUG = "c-training";
const COURSE_TITLE = "C Programming";
const COURSE_DESCRIPTION =
  "C programming programme — Pramanicus Academy";

const MODULE_META = [
  {
    slug: "files",
    sort_order: 1,
    title: "Files & File I/O",
    week: "Unit 6",
    subtitle: "Streams · fopen/fclose · fscanf/fprintf · getc/putc · fread/fwrite · fseek",
    level: "Intermediate",
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Make sure .env.local is filled in, then run: npm run seed:c",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const notesDir = path.join(process.cwd(), "course-notes", "c");

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
