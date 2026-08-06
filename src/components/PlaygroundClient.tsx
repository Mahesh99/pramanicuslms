"use client";

import { useEffect } from "react";

const DEFAULT_CODE = `# Welcome to the Python Playground!
# Write any Python 3 code here and click Run.

name = "Alice"
age = 20
print(f"Hello, {name}! You are {age} years old.")

# Try changing the values above, or write your own code:
for i in range(1, 6):
    print("Count:", i)
`;

const SNIPPETS: { label: string; code: string }[] = [
  {
    label: "Variables",
    code: `# Variables & types
name = "Bob"
score = 95.5
passed = True
print(name, score, passed)
print(type(name), type(score))`,
  },
  {
    label: "If / else",
    code: `# If / else
marks = 78
if marks >= 90:
    grade = "A"
elif marks >= 75:
    grade = "B"
else:
    grade = "C"
print(f"Grade: {grade}")`,
  },
  {
    label: "For loop",
    code: `# For loop & list
nums = [1, 2, 3, 4, 5]
squares = []
for n in nums:
    squares.append(n * n)
print(squares)`,
  },
  {
    label: "Function",
    code: `# Function
def greet(name, times=1):
    for _ in range(times):
        print(f"Hello, {name}!")

greet("Pramanicus", 3)`,
  },
];

export function PlaygroundClient() {
  useEffect(() => {
    const w = window as Window & { __pramanicusEnhanceCodeBlocks?: () => void };
    // Re-run playground init if script already loaded
    w.__pramanicusEnhanceCodeBlocks?.();
  }, []);

  return (
    <div className="playground-wrap">
      <div className="playground-banner">
        <div className="playground-banner-text">
          <strong>Try Python without leaving the browser.</strong> Powered by Pyodide
          (WebAssembly). First run downloads the runtime (~15 MB).
        </div>
      </div>

      <div id="pyodide-status" className="pyodide-status is-loading">
        Loading Python runtime…
      </div>

      <div className="playground-intro">
        <h2>Write your code below</h2>
        <p>
          Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (or <kbd>⌘</kbd>+<kbd>Enter</kbd>) to run.
        </p>
      </div>

      <div id="python-playground" className="playground-panel">
        <div className="playground-toolbar">
          <span className="playground-toolbar-title">main.py</span>
          <button type="button" className="playground-btn playground-run" aria-label="Run Python code">
            <span aria-hidden="true">▶</span> Run
          </button>
          <button type="button" className="playground-btn playground-reset" aria-label="Reset">
            Reset
          </button>
          <button type="button" className="playground-btn playground-clear" aria-label="Clear">
            Clear
          </button>
        </div>

        <textarea
          className="playground-editor"
          spellCheck={false}
          aria-label="Python code editor"
          data-default={DEFAULT_CODE}
          defaultValue={DEFAULT_CODE}
        />

        <div className="playground-output-label">Output</div>
        <div className="playground-output code-output" hidden aria-live="polite" />
      </div>

      <p className="playground-hint">
        <strong>Note:</strong> <code>input()</code> opens a browser prompt. File I/O and{" "}
        <code>pip install</code> are limited in the browser.
      </p>

      <div className="playground-snippets">
        <h3>Quick-start snippets</h3>
        <div className="playground-snippet-grid">
          {SNIPPETS.map((s) => (
            <button
              key={s.label}
              type="button"
              className="playground-snippet"
              data-code={s.code}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
