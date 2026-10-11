/**
 * Startup sequence. Runs once, after the terminal is wired and content is
 * loaded. Owns the statusbar clock, then hands straight off to `about` —
 * the landing experience IS the about section, no banner, no chip row.
 *
 * Kept out of terminal.js so the shell stays generic — boot is app chrome,
 * not part of dispatch.
 */

export async function boot(term, { autorun = false } = {}) {
  startClock();
  document.getElementById("input")?.focus();

  // Land the visitor on `about` instead of an empty prompt. A recruiter
  // should never have to guess that the site wants to be typed at.
  if (autorun) {
    const go = term.dispatch ?? term.run;
    await go?.("about", { noclear: true });
  }
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
