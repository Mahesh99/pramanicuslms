/**
 * One-time / re-runnable migration: converts legacy/module*.html into
 * Markdown and upserts it into Supabase `modules.content_md`.
 *
 * Run with: npm run seed:modules
 * (uses `node --env-file=.env.local` to load Supabase credentials)
 */
import { readFileSync } from "fs";
import path from "path";
import { load } from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { createClient } from "@supabase/supabase-js";

const COURSE_SLUG = "python-training";

const MODULE_META = [
  {
    slug: "module1",
    sort_order: 1,
    title: "Python Fundamentals",
    week: "Week 1",
    subtitle: "History · Installation · Variables · Types · Operators · I/O · PEP 8",
    level: "Beginner",
  },
  {
    slug: "module2",
    sort_order: 2,
    title: "Control Flow",
    week: "Week 1–2",
    subtitle: "Conditionals · Loops · Comprehensions · Pattern thinking",
    level: "Beginner",
  },
  {
    slug: "module3",
    sort_order: 3,
    title: "Data Structures",
    week: "Week 2",
    subtitle: "Lists · Tuples · Sets · Dictionaries · Nested structures",
    level: "Beginner",
  },
  {
    slug: "module4",
    sort_order: 4,
    title: "Functions",
    week: "Week 2",
    subtitle: "Defining functions · Arguments · Scope · Lambda · Recursion",
    level: "Intermediate",
  },
  {
    slug: "module5",
    sort_order: 5,
    title: "Object-Oriented Programming",
    week: "Week 3",
    subtitle: "Classes · Inheritance · Polymorphism · Dunder methods",
    level: "Intermediate",
  },
  {
    slug: "module6",
    sort_order: 6,
    title: "Exception Handling & File I/O",
    week: "Week 3",
    subtitle: "try/except · Custom errors · Files · Context managers",
    level: "Intermediate",
  },
  {
    slug: "module7",
    sort_order: 7,
    title: "Modules, Packages & Standard Library",
    week: "Week 4",
    subtitle: "import · Packages · pip · Popular stdlib modules",
    level: "Intermediate",
  },
  {
    slug: "module8",
    sort_order: 8,
    title: "Iterators, Generators & Decorators",
    week: "Week 4",
    subtitle: "Iterators · yield · Decorators · Advanced patterns",
    level: "Advanced",
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Make sure .env.local is filled in, then run: npm run seed:modules",
  );
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
turndown.use(gfm);

turndown.addRule("callout", {
  filter: (node) => node.nodeName === "DIV" && node.classList?.contains("callout"),
  replacement: (_content, node) => `\n\n${node.outerHTML}\n\n`,
});

turndown.addRule("keyPoint", {
  filter: (node) => node.nodeName === "DIV" && node.classList?.contains("key-point"),
  replacement: (_content, node) => `\n\n${node.outerHTML}\n\n`,
});

turndown.addRule("exercise", {
  filter: (node) => node.nodeName === "DIV" && node.classList?.contains("exercise"),
  replacement: (_content, node) => `\n\n${node.outerHTML}\n\n`,
});

turndown.addRule("twoCol", {
  filter: (node) => node.nodeName === "DIV" && node.classList?.contains("two-col"),
  replacement: (_content, node) => `\n\n${node.outerHTML}\n\n`,
});

turndown.addRule("codeBlock", {
  filter: (node) => node.nodeName === "DIV" && node.classList?.contains("code-block"),
  replacement: (_content, node) => `\n\n${node.outerHTML}\n\n`,
});

const legacyDir = path.join(process.cwd(), "legacy");

function rewriteLinks($, content) {
  content.find("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const m = href.match(/^module(\d+)\.html(.*)$/i);
    if (href === "index.html") $(el).attr("href", "/course");
    else if (href === "playground.html") $(el).attr("href", "/playground");
    else if (m) $(el).attr("href", `/course/module${m[1]}${m[2] || ""}`);
  });
}

async function main() {
  const { data: course, error: courseErr } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", COURSE_SLUG)
    .single();

  if (courseErr || !course) {
    console.error("Course not found. Run supabase/schema.sql first.", courseErr?.message);
    process.exit(1);
  }

  for (const meta of MODULE_META) {
    const file = path.join(legacyDir, `${meta.slug}.html`);
    const raw = readFileSync(file, "utf8");
    const $ = load(raw);
    $("script").remove();

    const content = $(".content").first();
    if (!content.length) {
      console.warn(`Skip ${meta.slug}: no .content element found`);
      continue;
    }

    rewriteLinks($, content);

    const markdown = turndown.turndown(content.html() || "").trim();

    const { error } = await supabase.from("modules").upsert(
      {
        course_id: course.id,
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
