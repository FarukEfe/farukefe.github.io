/**
 * The shell.
 *
 * Owns: the scrollback DOM, the input box, command history, dispatch.
 * Knows nothing about which commands exist — it reads the registry.
 * Commands know nothing about this file — they receive `ctx`.
 */

import { registry, complete, suggest } from "./commands/index.js";

export function createTerminal({ root, input, content }) {

  const history = [];
  let hIndex = 0;          // where we are when walking history with the arrows
  let busy = false;        // true while an async command is in flight

  /* ------------------------------------------------------------------
     write — the entire rendering engine
     ------------------------------------------------------------------
     Returns the element so a command can replace it later:
       const pending = ctx.write("fetching…");
       pending.remove();
     That's the only "state management" this app has, and it's why the
     return value matters.
  */
  function write(html, className = "block") {
    const el = document.createElement("div");
    el.className = className;
    el.innerHTML = html;
    root.appendChild(el);
    root.scrollTop = root.scrollHeight;
    return el;
  }

  /* Echo the typed line back, the way a real shell does. The margin on
     .echo is what visually separates one command's output from the next. */
  function echo(line) {
    write(`<span class="p">$</span> ${escapeText(line)}`, "echo");
  }

  /* Local escape so terminal.js has no imports besides the registry.
     render.js exports the same thing for commands to use. */
  function escapeText(s) {
    return String(s).replace(/[&<>"]/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  /* ------------------------------------------------------------------
     ctx — everything a command is allowed to touch
     ------------------------------------------------------------------
     Deliberately small. If a command needs something not on here, that's
     a signal to think about whether it belongs in the command at all.
  */
  const ctx = {
    content,
    write,
    clear: () => { root.innerHTML = ""; },
    run:   line => dispatch(line),
  };

  /* ------------------------------------------------------------------
     dispatch — parse, look up, execute
     ------------------------------------------------------------------ */
  async function dispatch(raw) {
    const line = raw.trim();
    echo(line);
    if (!line) return;

    history.push(line);
    hIndex = history.length;

    // DECISION 1: naive arg splitting. Breaks on `search "two words"`.
    // Fine until you add a command that needs quoted arguments; then
    // swap in a small tokenizer here and nothing else changes.
    const [name, ...args] = line.split(/\s+/);
    const cmd = registry.get(name.toLowerCase());

    // Statusbar breadcrumb: reflect the section you last looked at.
    const sb = document.getElementById("sb-section");
    if (sb && cmd) sb.textContent = cmd.name;

    if (!cmd) {
      const guess = suggest(name);
      write(
        `<span class="err">${escapeText(name)}: command not found.</span>` +
        (guess
          ? ` Did you mean <button class="cmd" data-cmd="${guess}">${guess}</button>?`
          : ` Try <button class="cmd" data-cmd="help">help</button>.`)
      );
      return;
    }

    // DECISION 2: lock the prompt while an async command runs. Simpler to
    // reason about than allowing interleaved output, and a portfolio has
    // no command slow enough for the lock to feel bad. If you'd rather
    // stay live, drop `busy` and accept that two fetches can interleave.
    busy = true;
    input.disabled = true;
    try {
      await cmd.run(args, ctx);
    } catch (err) {
      console.error(err);
      write(`<span class="err">${escapeText(name)}: failed.</span>`);
    } finally {
      busy = false;
      input.disabled = false;
      input.focus();
    }
  }

  /* ------------------------------------------------------------------
     keyboard
     ------------------------------------------------------------------ */
  input.addEventListener("keydown", e => {
    if (busy) return;

    switch (e.key) {

      case "Enter": {
        const line = input.value;
        input.value = "";
        dispatch(line);
        break;
      }

      case "Tab": {
        e.preventDefault();                      // don't let focus escape
        const prefix = input.value.trim().toLowerCase();
        const hits = complete(prefix);

        if (hits.length === 1) {
          input.value = hits[0];
        } else if (hits.length > 1) {
          // Shell behavior: show the options, keep what was typed.
          write(`<div class="chips">${hits
            .map(h => `<button class="cmd" data-cmd="${h}">${h}</button>`)
            .join("")}</div>`);
        }
        break;
      }

      case "ArrowUp":
        e.preventDefault();
        if (hIndex > 0) input.value = history[--hIndex];
        break;

      case "ArrowDown":
        e.preventDefault();
        if (hIndex < history.length - 1) {
          input.value = history[++hIndex];
        } else {
          hIndex = history.length;               // past the end = empty line
          input.value = "";
        }
        break;

      case "l":
        if (e.ctrlKey) { e.preventDefault(); ctx.clear(); }
        break;
    }
  });

  /* ------------------------------------------------------------------
     clicking
     ------------------------------------------------------------------
     One delegated listener on root, so any command's output can render
     clickable commands without registering handlers of its own. This is
     the whole "recruiter who won't type still gets the site" mechanism.
  */
  root.addEventListener("click", e => {
    const btn = e.target.closest("[data-cmd]");
    if (btn && !busy) {
      input.value = "";
      dispatch(btn.dataset.cmd);
      return;
    }

    // Click-to-copy, e.g. the email in `contact`. Kept here rather than in the
    // command so any output can render a [data-copy] button and it just works.
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      const text = copyBtn.dataset.copy;
      navigator.clipboard?.writeText(text).then(() => {
        const original = copyBtn.textContent;
        copyBtn.textContent = "copied ✓";
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.textContent = original;
          copyBtn.classList.remove("copied");
        }, 1200);
      });
    }
  });

  // DECISION 3: click anywhere neutral refocuses the prompt — it's what
  // a terminal does. Guarded so it doesn't fight text selection or steal
  // clicks meant for a link.
  document.addEventListener("click", e => {
    if (e.target.closest("a, button")) return;
    if (window.getSelection().toString()) return;
    input.focus();
  });

  return { dispatch, write, ctx };
}