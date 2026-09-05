/**
 * Sanity-check Advanced Excel markdown notes.
 * Run: node scripts/verify-excel-notes.mjs
 */
import { readdirSync, readFileSync } from "fs";
import path from "path";

const dir = path.join(process.cwd(), "course-notes", "excel");
const files = readdirSync(dir)
  .filter((f) => /^module\d+\.md$/.test(f))
  .sort();

if (files.length !== 9) {
  console.error(`Expected 9 module files, found ${files.length}: ${files.join(", ")}`);
  process.exit(1);
}

let failed = false;

for (const file of files) {
  const text = readFileSync(path.join(dir, file), "utf8");
  const checks = [
    [/> 🎯 \*\*Learning Objectives\*\*/, "objectives callout"],
    [/> 💡 \*\*Session Info\*\*/, "session info"],
    [/^Section \d+\.\d+/m, "Section X.Y label"],
    [/\n## /m, "H2 headings"],
    [/^Practice\s*$/m, "Practice label"],
    [/\/excel\/.+\.csv/, "dataset path"],
  ];

  for (const [re, label] of checks) {
    if (!re.test(text)) {
      console.error(`${file}: missing ${label}`);
      failed = true;
    }
  }

  const h2 = [...text.matchAll(/^## .+$/gm)].length;
  if (h2 < 4) {
    console.error(`${file}: expected at least 4 ## headings, found ${h2}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`OK — ${files.join(", ")}`);
