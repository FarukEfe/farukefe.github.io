/**
 * Click-to-copy on the email. Small touch, but it's the one field someone
 * actually needs to move somewhere else.
 */

import { escapeHtml, section, link, kv } from "../render.js";

export default {
  name: "contact",
  desc: "how to reach me",
  aliases: ["email", "hire"],

  run(args, ctx) {
    const c = ctx.content.contact;

    const rows = [
      ["email", `<button class="copy" data-copy="${escapeHtml(c.email)}">${escapeHtml(c.email)}</button>`],
      ...c.links.map(l => [l.label, link(l.url, l.url.replace(/^https?:\/\//, ""))]),
      ["resume", link(c.resume, "resume.pdf")],
    ];

    ctx.write(
      section("contact") +
      kv(rows) +
      `<p class="muted">Fastest reply is ${escapeHtml(c.preferred)}.</p>`
    );
  },
};