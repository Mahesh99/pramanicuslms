export type ModuleSection = {
  id: string;
  icon: string;
  label: string;
  title: string;
  body: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const EMOJI_RE =
  /^(\p{Extended_Pictographic}(?:\uFE0F)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F)?)*)/u;

function extractEmoji(line: string): string | null {
  const m = line.trim().match(EMOJI_RE);
  return m ? m[1] : null;
}

function isEmojiOnly(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  const emoji = extractEmoji(trimmed);
  return Boolean(emoji && trimmed === emoji);
}

function isSectionLabel(line: string): boolean {
  const trimmed = line.trim();
  return /^section\s/i.test(trimmed) || /^practice$/i.test(trimmed);
}

/**
 * Turndown emits section meta *before* the ## heading:
 *
 *   🏗️
 *   Section 5.1
 *   ## What is OOP?
 *
 * Splitting on `##` leaves that meta at the end of the previous chunk.
 * Peel it off so it becomes this section's icon/label.
 */
function peelTrailingMeta(text: string): {
  body: string;
  icon: string | null;
  label: string;
} {
  const lines = text.split("\n");
  let end = lines.length;

  while (end > 0 && !lines[end - 1].trim()) end--;

  let icon: string | null = null;
  let label = "";

  if (end > 0 && isSectionLabel(lines[end - 1])) {
    label = lines[end - 1].trim();
    end--;
    while (end > 0 && !lines[end - 1].trim()) end--;
  }

  if (end > 0 && isEmojiOnly(lines[end - 1])) {
    icon = lines[end - 1].trim();
    end--;
    while (end > 0 && !lines[end - 1].trim()) end--;
  }

  return {
    body: lines.slice(0, end).join("\n").trimEnd(),
    icon,
    label,
  };
}

export function parseModuleMarkdown(content: string): {
  intro: string;
  sections: ModuleSection[];
} {
  const normalized = content.replace(/\r\n/g, "\n");
  const chunks = normalized.split(/\n(?=## )/);
  let pending = chunks[0]?.startsWith("## ") ? "" : (chunks.shift() ?? "");
  const sections: ModuleSection[] = [];
  let intro = "";

  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const h2Idx = lines.findIndex((l) => l.startsWith("## "));
    if (h2Idx === -1) continue;

    const title = lines[h2Idx].replace(/^##\s+/, "").trim();
    const inlinePreamble = lines.slice(0, h2Idx);
    const rawBody = lines.slice(h2Idx + 1).join("\n");

    const peeled = peelTrailingMeta(pending);
    if (sections.length === 0) {
      intro = peeled.body.trim();
    } else {
      sections[sections.length - 1].body = peeled.body.trim();
    }

    let icon = peeled.icon ?? "📄";
    let label = peeled.label;

    for (const line of inlinePreamble) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const emoji = extractEmoji(trimmed);
      if (emoji && trimmed === emoji) {
        icon = emoji;
      } else if (isSectionLabel(trimmed)) {
        label = trimmed;
      }
    }

    if (!label && /exercise/i.test(title)) {
      label = "Practice";
      if (!peeled.icon) icon = "✏️";
    }

    sections.push({
      id: slugify(title),
      icon,
      label,
      title,
      body: rawBody.trim(),
    });

    pending = rawBody;
  }

  if (sections.length === 0) {
    intro = pending.trim();
  }

  return { intro, sections };
}
