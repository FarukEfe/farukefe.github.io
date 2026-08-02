/**
 * Grouped by honest comfort tier rather than self-rated percentages.
 * "Rust 80%" invites the question "80% of what?" — a tier label doesn't.
 */

import { escapeHtml, section } from "../render.js";

export default {
  name: "skills",
  desc: "what I work with",
  aliases: ["stack"],

  run(args, ctx) {
    const { groups, domains } = ctx.content.skills;

    const body = groups.map(g => `
      <div class="tier">
        <div class="tier-head">
          <span class="tier-name">${escapeHtml(g.name)}</span>
          <span class="tier-note">${escapeHtml(g.note)}</span>
        </div>
        <div class="tier-items">${g.items.map(escapeHtml).join("  ·  ")}</div>
      </div>`).join("");

    ctx.write(
      section("skills") +
      body +
      `<div class="tier">
         <div class="tier-head"><span class="tier-name">Domains</span></div>
         <div class="tier-items">${domains.map(escapeHtml).join("  ·  ")}</div>
       </div>`
    );
  },
};