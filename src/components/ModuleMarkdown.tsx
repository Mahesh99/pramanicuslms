"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";
import { parseModuleMarkdown } from "@/lib/parse-module-md";
import { highlightPython, preInnerToSource } from "@/lib/highlight-python";
import { ModuleSidebar } from "@/components/ModuleSidebar";
import { ModuleDatasetDownloads } from "@/components/ModuleDatasetDownloads";
import type { ModuleDatasetFile } from "@/lib/module-datasets";

const CALLOUT_EMOJI: Record<string, string> = {
  "🎯": "info",
  "💡": "tip",
  "⚠️": "warning",
  "🚨": "danger",
  "✅": "success",
};

function childrenToText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(childrenToText).join("\n");
  if (children && typeof children === "object" && "props" in children) {
    const el = children as { props?: { children?: ReactNode } };
    return childrenToText(el.props?.children ?? "");
  }
  return "";
}

function CalloutFromQuote({ children }: { children: ReactNode }) {
  const raw = childrenToText(children).trim();
  let emoji = "💡";
  let type = "info";
  let bodyText = raw;

  for (const [e, t] of Object.entries(CALLOUT_EMOJI)) {
    if (raw.includes(e)) {
      emoji = e;
      type = t;
      bodyText = raw.replace(e, "").trim();
      break;
    }
  }

  return (
    <div className={`callout ${type}`}>
      <div className="callout-icon">{emoji}</div>
      <div className="callout-body">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={inlineComponents}>
          {bodyText}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function KeyPointFromParagraph({ children }: { children: ReactNode }) {
  const text = childrenToText(children).trim();
  const match = text.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)$/);
  if (!match) return <p>{children}</p>;

  return (
    <div className="key-point">
      <strong>{match[1]}</strong>
      {match[2].trim() ? ` ${match[2].trim()}` : null}
    </div>
  );
}

const inlineComponents: Components = {
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong>{children}</strong>,
  code: ({ children }) => <code>{children}</code>,
  em: ({ children }) => <em>{children}</em>,
};

const mdComponents: Components = {
  blockquote: ({ children }) => <CalloutFromQuote>{children}</CalloutFromQuote>,

  p: ({ children }) => {
    const text = childrenToText(children).trim();
    if (/^\*\*Analogy/i.test(text)) return <KeyPointFromParagraph>{children}</KeyPointFromParagraph>;
    if (/^🏃\s*Exercise/i.test(text)) {
      return <div className="exercise-header">{text}</div>;
    }
    return <p>{children}</p>;
  },

  // Fenced markdown: our `code` renderer already returns a full .code-block, so unwrap
  // the outer <pre>. Raw HTML .code-block from seeded content needs a real <pre>.
  pre: ({ children }) => {
    const only = Array.isArray(children) ? (children.length === 1 ? children[0] : null) : children;
    if (
      only &&
      typeof only === "object" &&
      "props" in only &&
      typeof (only as { props?: { className?: string } }).props?.className === "string" &&
      (only as { props: { className: string } }).props.className.includes("code-block")
    ) {
      return <>{children}</>;
    }
    return <pre>{children}</pre>;
  },

  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (!isBlock) return <code>{children}</code>;

    const lang = className?.replace("language-", "") ?? "python";
    const codeText = String(children).replace(/\n$/, "");
    const isPython = /^py(thon)?$/i.test(lang);
    const highlighted = isPython ? highlightPython(codeText) : escapeHtmlText(codeText);

    return (
      <div className="code-block md-code-block">
        <div className="cb-header">
          <div className="cb-title">{lang}</div>
          <div className="cb-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
        <pre>
          <code className={className} dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    );
  },

  // Ensure token class names from rehype-raw HTML survive into the DOM
  span: ({ className, children }) => <span className={className}>{children}</span>,

  table: ({ children }) => (
    <div className="table-wrap">
      <table className="notes-table">{children}</table>
    </div>
  ),

  h3: ({ children }) => <h3>{children}</h3>,
  h4: ({ children }) => <h4>{children}</h4>,
  ul: ({ children }) => <ul>{children}</ul>,
  ol: ({ children }) => <ol>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
      {children}
    </a>
  ),
};

function MarkdownBody({ content }: { content: string }) {
  const normalized = useMemo(
    () => wrapBareCodeText(undentPreservedBlocks(content)),
    [content],
  );
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={mdComponents}
    >
      {normalized}
    </ReactMarkdown>
  );
}

/** List-nested HTML from turndown is indented 4+ spaces, which CommonMark treats as a code fence. */
function undentPreservedBlocks(md: string): string {
  const startRe =
    /^([ \t]{4,})(<div class="(?:code-block|callout|key-point|exercise|two-col)")/;
  const lines = md.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const match = lines[i].match(startRe);
    if (!match) {
      out.push(lines[i]);
      i++;
      continue;
    }

    const indent = match[1];
    let depth = 0;
    while (i < lines.length) {
      let line = lines[i];
      if (line.startsWith(indent)) line = line.slice(indent.length);
      out.push(line);
      depth += (line.match(/<div\b/gi) || []).length;
      depth -= (line.match(/<\/div>/gi) || []).length;
      i++;
      if (depth <= 0) break;
    }
  }

  return out.join("\n");
}

function escapeHtmlText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Re-tokenize every &lt;pre&gt; as Python so functions, operators, strings,
 * numbers, and comments get distinct IDE-style colors (course.css token classes).
 */
function wrapBareCodeText(md: string): string {
  return md.replace(/<pre>([\s\S]*?)<\/pre>/gi, (_full, inner: string) => {
    const source = preInnerToSource(inner);
    return `<pre>${highlightPython(source)}</pre>`;
  });
}

function wrapExerciseBlocks(body: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    if (/^🏃\s*Exercise/i.test(lines[i].trim())) {
      const title = lines[i].trim();
      i++;
      const block: string[] = [
        `<div class="exercise">`,
        `<div class="exercise-header">${title}</div>`,
      ];
      while (i < lines.length && !/^🏃\s*Exercise/i.test(lines[i].trim())) {
        block.push(lines[i]);
        i++;
      }
      block.push("</div>");
      out.push(block.join("\n"));
      continue;
    }
    out.push(lines[i]);
    i++;
  }

  return out.join("\n");
}

export function ModuleMarkdown({
  content,
  moduleNum,
  datasets = [],
}: {
  content: string;
  moduleNum: number;
  datasets?: ModuleDatasetFile[];
}) {
  const { intro, sections } = useMemo(() => {
    const parsed = parseModuleMarkdown(content);
    return {
      intro: parsed.intro,
      sections: parsed.sections.map((s) => ({
        ...s,
        body: wrapExerciseBlocks(s.body),
      })),
    };
  }, [content]);

  useEffect(() => {
    const w = window as Window & { __pramanicusEnhanceCodeBlocks?: () => void };
    w.__pramanicusEnhanceCodeBlocks?.();
  }, [content]);

  return (
    <div className="layout">
      <ModuleSidebar moduleNum={moduleNum} sections={sections} />
      <main className="content">
        <ModuleDatasetDownloads files={datasets} />
        {intro ? (
          <div className="content-intro">
            <MarkdownBody content={intro} />
          </div>
        ) : null}

        {sections.map((section) => (
          <section key={section.id} className="content-section" id={section.id}>
            <div className="section-header">
              <div className="section-icon">{section.icon}</div>
              <div className="section-meta">
                {section.label ? <div className="label">{section.label}</div> : null}
                <h2>{section.title}</h2>
              </div>
            </div>
            <div className="section-body">
              <MarkdownBody content={section.body} />
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
