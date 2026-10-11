/**
 * Startup sequence. Runs once, after the terminal is wired and content is
 * loaded. Hands straight off to `about` — the landing experience IS the
 * about section, no banner, no chip row, no clock.
 *
 * Kept out of terminal.js so the shell stays generic — boot is app chrome,
 * not part of dispatch.
 */

export async function boot(term, { autorun = false } = {}) {
  document.getElementById("input")?.focus();

  // Land the visitor on `about` instead of an empty prompt. A recruiter
  // should never have to guess that the site wants to be typed at.
  if (autorun) {
    const go = term.dispatch ?? term.run;
    await go?.("about", { noclear: true });
  }
}
