import { readFileSync } from "fs";
import { load } from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
turndown.use(gfm);

for (const cls of ["callout", "key-point", "exercise", "two-col", "code-block"]) {
  turndown.addRule(cls, {
    filter: (node) => node.nodeName === "DIV" && node.classList?.contains(cls),
    replacement: (_c, node) => `\n\n${node.outerHTML}\n\n`,
  });
}

const raw = readFileSync("legacy/module5.html", "utf8");
const $ = load(raw);
const content = $(".content").first();
const md = turndown.turndown(content.html() || "").trim();

console.log("## count:", (md.match(/^## /gm) || []).length);
console.log("\n--- First H2 context ---");
const idx = md.indexOf("## ");
console.log(md.slice(Math.max(0, idx - 300), idx + 600));

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}
const chunks = md.split(/\n(?=## )/);
const intro = chunks[0]?.startsWith("## ") ? "" : (chunks.shift() ?? "").trim();
console.log("\nIntro length:", intro.length);
console.log("Section chunks:", chunks.length);
for (const chunk of chunks.slice(0, 3)) {
  const lines = chunk.split("\n");
  const h2Idx = lines.findIndex((l) => l.startsWith("## "));
  const title = lines[h2Idx].replace(/^##\s+/, "").trim();
  console.log(" -", title, "id:", slugify(title));
}
