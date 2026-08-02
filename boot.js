/**
 * Startup sequence. Runs once, after the terminal is wired and content is
 * loaded. Owns the two things nothing else touches: the statusbar clock and
 * the opening banner.
 *
 * Kept out of terminal.js so the shell stays generic — boot is app chrome,
 * not part of dispatch.
 */

import { config } from "./config.js";
import { chips } from "./render.js";

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* Clickable entry points. Ordered the way you'd want someone to read them. */
const START_HERE = ["about", "projects", "skills", "experience", "education", "contact", "help"];

export async function boot(term) {
  startClock();

  // Border sized from the title so the box always closes, whatever you edit.
  const title = "  Faruk Efe Yencilek — Portfolio  ";
  const bar = "─".repeat(title.length);
  const banner = [`┌${bar}┐`, `│${title}│`, `└${bar}┘`].join("\n");

  term.write(`<pre style="color:var(--accent);margin:0">${banner}</pre>`);

  await sleep(config.bootDelay);

  term.write(
    `<p class="muted">Type a command, or click one below. ` +
    `<button class="cmd" data-cmd="help">help</button> lists everything.</p>` +
    chips(START_HERE)
  );

  document.getElementById("input")?.focus();
}

/* Ticks #sb-clock once a second. Static after this — no other file writes it. */
function startClock() {
  const el = document.getElementById("sb-clock");
  if (!el) return;

  const pad = n => String(n).padStart(2, "0");
  const tick = () => {
    const d = new Date();
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  tick();
  setInterval(tick, 1000);
}
