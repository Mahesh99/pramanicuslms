/**
 * Browser Python runner powered by Pyodide (WebAssembly).
 * Adds Run buttons to code blocks and powers the playground editor.
 */
(function () {
  'use strict';

  const PYODIDE_VERSION = '0.27.6';
  const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

  let pyodidePromise = null;
  let inputShimInstalled = false;

  function loadPyodideOnce() {
    if (!pyodidePromise) {
      if (typeof globalThis.loadPyodide !== 'function') {
        pyodidePromise = Promise.reject(
          new Error('Pyodide failed to load. Check your network connection and refresh the page.')
        );
      } else {
        pyodidePromise = globalThis.loadPyodide({ indexURL: PYODIDE_CDN }).then((pyodide) => {
          installInputShim(pyodide);
          return pyodide;
        });
      }
    }
    return pyodidePromise;
  }

  function installInputShim(pyodide) {
    if (inputShimInstalled) return;
    pyodide.runPython(`
import builtins

def _browser_input(prompt=''):
    from js import prompt as js_prompt
    result = js_prompt(str(prompt) if prompt else 'Input:')
    return '' if result is None else str(result)

builtins.input = _browser_input
`);
    inputShimInstalled = true;
  }

  function getSourceFromPre(pre) {
    return pre.innerText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd();
  }

  function isRunnableBlock(block) {
    if (block.dataset.noRun !== undefined || block.classList.contains('no-run')) {
      return false;
    }

    const title = (block.querySelector('.cb-title')?.textContent || '').toLowerCase().trim();
    const skipTitles = [
      'terminal',
      'interactive shell',
      'python 3 keywords',
      'command line',
      'powershell',
      'bash',
      'output',
      'expected output',
    ];
    if (skipTitles.some((t) => title.includes(t))) return false;

    const pre = block.querySelector('pre');
    if (!pre) return false;

    const text = getSourceFromPre(pre);
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return false;

    const first = lines[0];
    if (/^(\$|>>>|C:\\|PS>|pip |python |py )/.test(first)) return false;
    if (/^Python \d+\.\d+/.test(first)) return false;

    const hasCodeIndicators = /[=()]|\bprint\b|\bdef\b|\bclass\b|\bimport\b|\bfor\b|\bwhile\b/.test(text);
    if (!hasCodeIndicators) {
      const keywordOnly = lines.every((line) => /^[\w\s]+$/.test(line));
      if (keywordOnly) return false;
    }

    return true;
  }

  function ensureOutputPanel(block) {
    let output = block.querySelector('.code-output');
    if (!output) {
      output = document.createElement('div');
      output.className = 'code-output';
      output.hidden = true;
      output.setAttribute('aria-live', 'polite');
      block.appendChild(output);
    }
    return output;
  }

  function ensureRunButton(block) {
    const header = block.querySelector('.cb-header');
    if (!header || header.querySelector('.cb-run')) return null;

    const actions = document.createElement('div');
    actions.className = 'cb-header-actions';

    const runBtn = document.createElement('button');
    runBtn.type = 'button';
    runBtn.className = 'cb-run';
    runBtn.innerHTML = '<span class="cb-run-icon" aria-hidden="true">▶</span> Run';
    runBtn.setAttribute('aria-label', 'Run Python code in browser');
    runBtn.addEventListener('click', () => runCodeBlock(block, runBtn));

    const dots = header.querySelector('.cb-dots');
    actions.appendChild(runBtn);
    if (dots) actions.appendChild(dots);
    header.appendChild(actions);

    block.classList.add('runnable');
    return runBtn;
  }

  function setButtonState(btn, state) {
    if (!btn) return;
    btn.disabled = state === 'loading' || state === 'running';
    if (state === 'loading') {
      btn.innerHTML = '<span class="cb-run-spinner" aria-hidden="true"></span> Loading…';
    } else if (state === 'running') {
      btn.innerHTML = '<span class="cb-run-spinner" aria-hidden="true"></span> Running…';
    } else {
      btn.innerHTML = '<span class="cb-run-icon" aria-hidden="true">▶</span> Run';
    }
  }

  function formatError(err) {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    return err.message || String(err);
  }

  async function runPython(code, outputEl, runBtn) {
    setButtonState(runBtn, 'loading');
    outputEl.hidden = false;
    outputEl.className = 'code-output is-loading';
    outputEl.textContent = 'Loading Python runtime (first run may take 10–20 seconds)…';

    try {
      const pyodide = await loadPyodideOnce();

      setButtonState(runBtn, 'running');
      outputEl.className = 'code-output';
      outputEl.textContent = '';

      let stdout = '';
      let stderr = '';

      pyodide.setStdout({
        batched: (msg) => {
          stdout += msg;
          outputEl.textContent = stdout + stderr;
          outputEl.classList.remove('is-muted');
        },
      });
      pyodide.setStderr({
        batched: (msg) => {
          stderr += msg;
          outputEl.textContent = stdout + stderr;
          outputEl.classList.remove('is-muted');
        },
      });

      await pyodide.runPythonAsync(code);

      if (!stdout && !stderr) {
        outputEl.textContent = '(Program finished with no output)';
        outputEl.classList.add('is-muted');
      }
    } catch (err) {
      outputEl.className = 'code-output is-error';
      outputEl.textContent = formatError(err);
    } finally {
      setButtonState(runBtn, 'idle');
    }
  }

  async function runCodeBlock(block, runBtn) {
    const pre = block.querySelector('pre');
    if (!pre) return;
    const output = ensureOutputPanel(block);
    await runPython(getSourceFromPre(pre), output, runBtn);
  }

  function initCodeBlocks() {
    document.querySelectorAll('.code-block').forEach((block) => {
      if (isRunnableBlock(block)) ensureRunButton(block);
    });
  }

  function initPlayground() {
    const playground = document.getElementById('python-playground');
    if (!playground) return;

    const editor = playground.querySelector('.playground-editor');
    const output = playground.querySelector('.playground-output');
    const runBtn = playground.querySelector('.playground-run');
    const clearBtn = playground.querySelector('.playground-clear');
    const resetBtn = playground.querySelector('.playground-reset');
    const defaultCode = editor?.dataset.default || editor?.value || '';

    runBtn?.addEventListener('click', async () => {
      if (!editor || !output) return;
      await runPython(editor.value, output, runBtn);
    });

    clearBtn?.addEventListener('click', () => {
      if (editor) editor.value = '';
      if (output) {
        output.hidden = true;
        output.textContent = '';
        output.className = 'playground-output code-output';
      }
    });

    resetBtn?.addEventListener('click', () => {
      if (editor) editor.value = defaultCode;
      if (output) {
        output.hidden = true;
        output.textContent = '';
        output.className = 'playground-output code-output';
      }
    });

    editor?.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        runBtn?.click();
      }
    });

    playground.querySelectorAll('.playground-snippet').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!editor) return;
        editor.value = btn.dataset.code || '';
        editor.focus();
      });
    });
  }

  function initRuntimeBanner() {
    const banner = document.getElementById('pyodide-status');
    if (!banner) return;

    banner.textContent = 'Loading Python runtime…';
    banner.className = 'pyodide-status is-loading';

    loadPyodideOnce()
      .then(() => {
        banner.textContent = 'Python runtime ready — you can run code in your browser';
        banner.className = 'pyodide-status is-ready';
      })
      .catch(() => {
        banner.textContent = 'Could not load Python runtime. Check your connection and refresh.';
        banner.className = 'pyodide-status is-error';
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initCodeBlocks();
    initPlayground();
    initRuntimeBanner();
  });
})();
