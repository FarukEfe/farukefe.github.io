/**
 * Shared output vocabulary.
 *
 * Rules for this file:
 *   - every function returns a string, never a DOM node
 *   - nothing here touches `document`
 *   - no imports, no state
 *
 * That's what makes it the bottom of the dependency graph: everything can
 * import it, it imports nothing. Change how a heading looks here and every
 * command updates.
 *
 * Add a helper when you need a pattern the SECOND time, not the first.
 */

/* ---------------------------------------------------------------- text */

/**
 * Escape before anything reaches innerHTML.
 *
 * Your own JSON is safe because you wrote it. Anything from an API is not —
 * a GitHub repo description is arbitrary text from a stranger. Wrap every
 * value you didn't author.
 */
export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ------------------------------------------------------------ structure */

/**
 * Section heading plus a box-drawing rule.
 *
 * The rule is a fixed run of ─ that CSS clips with overflow:hidden. That's
 * how you get a full-bleed line in monospace without measuring the column.
 */
export function section(title) {
  return `<h2 class="head">${escapeHtml(title)}</h2>` +
         `<div class="rule">${"─".repeat(120)}</div>`;
}

export function para(html, cls = "") {
  return `<p${cls ? ` class="${cls}"` : ""}>${html}</p>`;
}

/** Key/value list. Takes [[key, valueHtml], ...] — keys escaped, values not. */
export function kv(rows) {
  const body = rows
    .map(([k, v]) => `<dt>${escapeHtml(k)}</dt><dd>${v}</dd>`)
    .join("");
  return `<dl class="kv">${body}</dl>`;
}

/* ------------------------------------------------------------ elements */

/**
 * A clickable command. terminal.js delegates clicks on [data-cmd], so this
 * works anywhere in the scrollback with no wiring.
 *
 * This is the single most important function in the file — it's what lets
 * someone use the whole site without typing.
 */
export function cmdLink(name, label = name) {
  return `<button class="cmd" data-cmd="${escapeHtml(name)}">${escapeHtml(label)}</button>`;
}

export function chips(names) {
  return `<div class="chips">${names.map(n => cmdLink(n)).join("")}</div>`;
}

export function link(href, label = href) {
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
}

/** Reverse-video status tag: SHIPPED, WIP, ARCHIVED. */
export function badge(text, variant = "") {
  return `<span class="badge${variant ? " " + variant : ""}">${escapeHtml(text)}</span>`;
}

/* --------------------------------------------------------------- units */

/** Unicode sparkline. Pass an array of numbers, get ▁▂▃▅▇ back. */
export function sparkline(values) {
  if (!values?.length) return `<span class="dim">—</span>`;
  const ticks = "▁▂▃▄▅▆▇█";
  const max = Math.max(1, ...values);
  const out = values
    .map(v => ticks[Math.min(7, Math.floor((v / max) * 7))])
    .join("");
  return `<span class="spark">${out}</span>`;
}

/** Horizontal bar from block characters, given a 0-100 percentage. */
export function bar(pct, width = 20) {
  const filled = Math.round((Math.max(0, Math.min(100, pct)) / 100) * width);
  return `<span class="bar">` +
         `<span class="on">${"█".repeat(filled)}</span>` +
         `${"░".repeat(width - filled)}</span>`;
}

/** "3d ago", "2mo ago". Takes an ISO date string. */
export function ago(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (Number.isNaN(days)) return "";
  if (days <= 0)   return "today";
  if (days === 1)  return "yesterday";
  if (days < 30)   return `${days}d ago`;
  if (days < 365)  return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

/**
 * Pad to a fixed column width. Monospace makes this exact, which is how you
 * get aligned output without a table.
 *
 * Only works for Latin text — CJK characters occupy two cells, emoji vary.
 * Fine for command names and language labels.
 */
export function pad(str, width) {
  const s = String(str);
  return s.length >= width ? s : s + " ".repeat(width - s.length);
}