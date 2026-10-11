/**
 * The one command a recruiter is actually looking for. Hands over the PDF
 * and the email in one screen, nothing else.
 */

import { escapeHtml, section, link } from "../render.js";

export default {
  name: "resume",
  desc: "grab the PDF",
  aliases: ["pdf"],
  section: true,

  run(args, ctx) {
    const email = ctx.content.contact?.email ?? "";

    ctx.write(
      section("resume") +
      `<p>One page, PDF format, kept current.</p>` +
      `<p>${link("./static/resume.pdf", "open resume.pdf ↗")}</p>` +
      (email
        ? `<p class="muted">Prefer to talk? <button class="copy" data-copy="${escapeHtml(email)}">${escapeHtml(email)}</button></p>`
        : "")
    );
  },
};
