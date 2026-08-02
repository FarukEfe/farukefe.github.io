import { escapeHtml, section } from "../render.js";

export default {
  name: "education",
  desc: "where I studied",
  aliases: ["edu"],

  run(args, ctx) {
    const body = ctx.content.education.map(e => `
      <div class="edu">
        <div class="edu-head">
          <b>${escapeHtml(e.degree)}</b>
          <span class="when">${escapeHtml(e.start)} — ${escapeHtml(e.end)}</span>
        </div>
        <div class="org">${escapeHtml(e.institution)}<span class="muted">, ${escapeHtml(e.location)}</span></div>
        ${e.note ? `<p class="muted">${escapeHtml(e.note)}</p>` : ""}
        ${e.coursework?.length
          ? `<div class="course"><span class="muted">Coursework:</span> ${e.coursework.map(escapeHtml).join(" · ")}</div>`
          : ""}
      </div>`).join("");

    ctx.write(section("education") + body);
  },
};