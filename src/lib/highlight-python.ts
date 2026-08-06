/** Minimal Python syntax highlighter → spans matching course.css token classes. */

const KEYWORDS = new Set([
  "False",
  "None",
  "True",
  "and",
  "as",
  "assert",
  "async",
  "await",
  "break",
  "class",
  "continue",
  "def",
  "del",
  "elif",
  "else",
  "except",
  "finally",
  "for",
  "from",
  "global",
  "if",
  "import",
  "in",
  "is",
  "lambda",
  "nonlocal",
  "not",
  "or",
  "pass",
  "raise",
  "return",
  "try",
  "while",
  "with",
  "yield",
]);

const BUILTINS = new Set([
  "abs",
  "all",
  "any",
  "ascii",
  "bin",
  "bool",
  "bytearray",
  "bytes",
  "callable",
  "chr",
  "classmethod",
  "compile",
  "complex",
  "dict",
  "dir",
  "divmod",
  "enumerate",
  "eval",
  "exec",
  "filter",
  "float",
  "format",
  "frozenset",
  "getattr",
  "globals",
  "hasattr",
  "hash",
  "help",
  "hex",
  "id",
  "input",
  "int",
  "isinstance",
  "issubclass",
  "iter",
  "len",
  "list",
  "locals",
  "map",
  "max",
  "memoryview",
  "min",
  "next",
  "object",
  "oct",
  "open",
  "ord",
  "pow",
  "print",
  "property",
  "range",
  "repr",
  "reversed",
  "round",
  "set",
  "setattr",
  "slice",
  "sorted",
  "staticmethod",
  "str",
  "sum",
  "super",
  "tuple",
  "type",
  "vars",
  "zip",
  "__import__",
  "NotImplemented",
  "Ellipsis",
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function span(cls: string, text: string): string {
  return `<span class="${cls}">${escapeHtml(text)}</span>`;
}

/**
 * Highlight Python source into HTML using .kw/.fn/.str/.num/.cm/.op/.br/.tok/.bi/.cls/.dec
 */
export function highlightPython(source: string): string {
  let i = 0;
  const n = source.length;
  let out = "";
  let afterClass = false;
  let afterDef = false;

  while (i < n) {
    const ch = source[i];

    // Comments
    if (ch === "#") {
      let j = i + 1;
      while (j < n && source[j] !== "\n") j++;
      out += span("cm", source.slice(i, j));
      i = j;
      continue;
    }

    // Strings (incl. prefixes r/f/b/u and triples)
    if (
      ch === "'" ||
      ch === '"' ||
      ((ch === "r" || ch === "R" || ch === "f" || ch === "F" || ch === "b" || ch === "B" || ch === "u" || ch === "U") &&
        (source[i + 1] === "'" ||
          source[i + 1] === '"' ||
          ((source[i + 1] === "r" ||
            source[i + 1] === "R" ||
            source[i + 1] === "f" ||
            source[i + 1] === "F" ||
            source[i + 1] === "b" ||
            source[i + 1] === "B") &&
            (source[i + 2] === "'" || source[i + 2] === '"'))))
    ) {
      let j = i;
      // consume letter prefixes
      while (j < n && /[rRuUfFbB]/.test(source[j])) j++;
      const quote = source[j];
      if (quote !== "'" && quote !== '"') {
        // not actually a string — fall through to identifier
      } else {
        const triple = source.slice(j, j + 3) === quote + quote + quote;
        j += triple ? 3 : 1;
        while (j < n) {
          if (source[j] === "\\") {
            j += 2;
            continue;
          }
          if (triple) {
            if (source.slice(j, j + 3) === quote + quote + quote) {
              j += 3;
              break;
            }
          } else if (source[j] === quote) {
            j++;
            break;
          } else if (source[j] === "\n") {
            break;
          }
          j++;
        }
        out += span("str", source.slice(i, j));
        i = j;
        continue;
      }
    }

    // Decorators
    if (ch === "@" && (i === 0 || source[i - 1] === "\n" || /\s/.test(source[i - 1]))) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_.]/.test(source[j])) j++;
      out += span("dec", source.slice(i, j));
      i = j;
      continue;
    }

    // Numbers
    if (
      /\d/.test(ch) ||
      (ch === "." && /\d/.test(source[i + 1] || "")) ||
      (ch === "0" && /[xXoObB]/.test(source[i + 1] || ""))
    ) {
      let j = i;
      if (source[j] === "0" && /[xXoObB]/.test(source[j + 1] || "")) {
        j += 2;
        while (j < n && /[0-9A-Fa-f_]/.test(source[j])) j++;
      } else {
        while (j < n && /[0-9_]/.test(source[j])) j++;
        if (source[j] === "." && /\d/.test(source[j + 1] || "")) {
          j++;
          while (j < n && /[0-9_]/.test(source[j])) j++;
        }
        if (/[eE]/.test(source[j] || "")) {
          j++;
          if (/[+-]/.test(source[j] || "")) j++;
          while (j < n && /[0-9_]/.test(source[j])) j++;
        }
        if (/[jJ]/.test(source[j] || "")) j++;
      }
      out += span("num", source.slice(i, j));
      i = j;
      continue;
    }

    // Identifiers / keywords / builtins / calls
    if (/[A-Za-z_]/.test(ch)) {
      let j = i + 1;
      while (j < n && /[A-Za-z0-9_]/.test(source[j])) j++;
      const word = source.slice(i, j);

      let k = j;
      while (k < n && /[ \t]/.test(source[k])) k++;
      const isCall = source[k] === "(";

      if (KEYWORDS.has(word)) {
        out += span("kw", word);
        afterClass = word === "class";
        afterDef = word === "def";
      } else if (afterClass) {
        out += span("cls", word);
        afterClass = false;
        afterDef = false;
      } else if (afterDef || isCall) {
        out += span(BUILTINS.has(word) ? "bi" : "fn", word);
        afterDef = false;
        afterClass = false;
      } else if (BUILTINS.has(word)) {
        out += span("bi", word);
        afterDef = false;
        afterClass = false;
      } else if (/^[A-Z][A-Za-z0-9_]*$/.test(word) && word.length > 1) {
        out += span("cls", word);
        afterDef = false;
        afterClass = false;
      } else {
        out += span("tok", word);
        afterDef = false;
        afterClass = false;
      }
      i = j;
      continue;
    }

    // Brackets — white (not operator cyan)
    if (/[()\[\]{}]/.test(ch)) {
      out += span("br", ch);
      i++;
      afterClass = false;
      afterDef = false;
      continue;
    }

    // Operators & punctuation
    if (/[+\-*/%@&|^~<>=!?:.,;\\]/.test(ch)) {
      let j = i + 1;
      const two = source.slice(i, i + 2);
      const three = source.slice(i, i + 3);
      if (["//=", ">>=", "<<=", "**=", "..."].includes(three)) {
        j = i + 3;
      } else if (
        [
          "//",
          "**",
          "<<",
          ">>",
          "==",
          "!=",
          "<=",
          ">=",
          ":=",
          "->",
          "+=",
          "-=",
          "*=",
          "/=",
          "%=",
          "&=",
          "|=",
          "^=",
        ].includes(two)
      ) {
        j = i + 2;
      }
      out += span("op", source.slice(i, j));
      i = j;
      afterClass = false;
      afterDef = false;
      continue;
    }

    // Whitespace & other — keep visible via tok when non-whitespace
    if (/\s/.test(ch)) {
      out += escapeHtml(ch);
      if (ch === "\n") {
        afterClass = false;
        afterDef = false;
      }
      i++;
      continue;
    }

    out += span("tok", ch);
    i++;
  }

  return out;
}

/** Strip existing HTML tags / entities from a &lt;pre&gt; inner HTML blob → plain source. */
export function preInnerToSource(innerHtml: string): string {
  return innerHtml
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'");
}
