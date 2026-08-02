/**
 * neofetch layout — ASCII art on the left, key/values on the right.
 * The most recognizable terminal layout there is; anyone technical
 * clocks it instantly.
 */

import { escapeHtml, section, cmdLink } from "../render.js";

export default {
  name: "about",
  desc: "who I am",
  aliases: ["whoami"],

  run(args, ctx) {
    const me = ctx.content.about;

    const rows = [
      ["role",     escapeHtml(me.role)],
      ["location", escapeHtml(me.location)],
      ["now",      escapeHtml(me.now)],
      me.available ? ["status", `<span class="ok">${escapeHtml(me.availability_note)}</span>`] : null,
    ].filter(Boolean);

    const info = rows
      .map(([k, v]) => `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`)
      .join("");

    const bio = me.bio.map(p => `<p>${escapeHtml(p)}</p>`).join("");

    ctx.write(
      section("about") +
      `<div class="neofetch">
         <pre class="art">${escapeHtml(me.ascii.join("\n"))}</pre>
         <div class="info">
           <div class="who"><b>${escapeHtml(me.name)}</b>@<span class="host">${escapeHtml(me.handle)}</span></div>
           <div class="sep">${"─".repeat(28)}</div>
           ${info}
         </div>
       </div>` +
      `<p class="lede">${escapeHtml(me.tagline)}</p>` +
      bio +
      `<p class="muted">Next: ${cmdLink("projects")} ${cmdLink("experience")} ${cmdLink("contact")}</p>`
    );
  },
};