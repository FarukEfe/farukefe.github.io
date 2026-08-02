/**
 * The map of the whole site. Reads the registry so it can never drift out of
 * sync with what actually exists — add a command and it shows up here for free.
 */

import { escapeHtml, section } from "../render.js";
import { cmdLink } from "../render.js";
import { visible } from "./index.js";

export default {
  name: "help",
  desc: "list every command",
  aliases: ["?", "commands"],

  run(args, ctx) {
    const rows = visible().map(c => {
      const aka = c.aliases?.length
        ? ` <span class="muted">(${c.aliases.map(escapeHtml).join(", ")})</span>`
        : "";
      return `<dt>${cmdLink(c.name)}</dt><dd>${escapeHtml(c.desc)}${aka}</dd>`;
    }).join("");

    ctx.write(
      section("help") +
      `<dl class="kv">${rows}</dl>` +
      `<p class="muted">Tab completes · ↑ ↓ walk history · Ctrl-L clears.</p>`
    );
  },
};
