/**
 * Timeline with a box-drawing gutter. The ├─ / ╰─ characters do the work
 * a border-left would do in a normal design, and read as terminal-native.
 */

import { escapeHtml, section, link } from "../render.js";

const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function when(start, end) {
  const fmt = s => {
    if (!s) return "now";
    const [y, m] = s.split("-");
    return m ? `${month[+m - 1]} ${y}` : y;
  };
  return `${fmt(start)} — ${fmt(end)}`;
}

export default {
  name: "experience",
  desc: "where I've worked",
  aliases: ["work-history", "cv"],

  run(args, ctx) {
    const roles = ctx.content.experience;

    const body = roles.map((r, i) => {
      // Kept on single physical lines: .line is pre-wrap, so any newline or
      // indentation between the inline spans would render as literal padding.
      const bullets = r.highlights
        .map(h => `<div class="line bullet"><span class="g"> • </span> <span class="muted">${escapeHtml(h)}</span></div>`)
        .join("");

      return `<div class="entry">` +
        `<div class="line head"><b>${escapeHtml(r.role)}</b> <span class="org">@ ${escapeHtml(r.org)}</span> <span class="when">${escapeHtml(when(r.start, r.end))}</span></div>` +
        `<div class="line"><span class="stack">${escapeHtml(r.stack.join(" · "))}</span></div>` +
        bullets +
        (r.link ? `<div class="line bullet fg">Find more at: ${link(r.link, r.link)}</div>` : "") +
        `</div>`;
    }).join("");

    ctx.write(section("experience") + `<div class="timeline">${body}</div>`);
  },
};