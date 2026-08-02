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
      const last = i === roles.length - 1;
      // After the last node the rail must stop, so its body lines drop the │.
      const rail = last ? " " : "│";

      // Kept on single physical lines: .line is pre-wrap, so any newline or
      // indentation between the inline spans would render as literal padding.
      const bullets = r.highlights
        .map(h => `<div class="line bullet"><span class="g">${rail}  •</span> ${escapeHtml(h)}</div>`)
        .join("");

      return `<div class="entry">` +
        `<div class="line head"><span class="g">${last ? "╰─" : "├─"}</span> <b>${escapeHtml(r.role)}</b> <span class="org">@ ${escapeHtml(r.org)}</span> <span class="when">${escapeHtml(when(r.start, r.end))}</span></div>` +
        `<div class="line"><span class="g">${rail}</span>  <span class="stack">${escapeHtml(r.stack.join(" · "))}</span></div>` +
        `<div class="line"><span class="g">${rail}</span>  <span class="muted">${escapeHtml(r.summary)}</span></div>` +
        bullets +
        `<div class="line"><span class="g">${rail}</span>  Find more at: ${r.link ? link(r.link, r.link) : ""}</div>` +
        `</div>`;
    }).join("");

    ctx.write(section("experience") + `<div class="timeline">${body}</div>`);
  },
};