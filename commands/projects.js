/**
 * Two views in one command:
 *   projects           aligned table, scannable in five seconds
 *   projects <slug>    full detail for one project
 *
 * Progressive disclosure — the list stays short, the depth is one word away.
 */

import { escapeHtml, section, cmdLink, link, badge } from "../render.js";

export default {
  name: "projects",
  desc: "things I've built",
  aliases: ["work"],

  run(args, ctx) {
    const all = ctx.content.projects;

    if (args[0]) return detail(all, args[0], ctx);

    const rows = all.map(p => `
      <tr>
        <td class="name"><span class="mk">›</span> ${cmdLink(`projects ${p.slug}`, p.name)}</td>
        <td class="stack">${escapeHtml(p.stack.join(" · "))}</td>
        <td class="year">${escapeHtml(p.year)}</td>
      </tr>
      <tr class="sub"><td colspan="3">${escapeHtml(p.tagline)}</td></tr>`).join("");

    ctx.write(
      section("projects") +
      `<table class="projects">
         <thead><tr><th>name</th><th>stack</th><th>year</th></tr></thead>
         <tbody>${rows}</tbody>
       </table>` +
      `<p class="muted">Click a name, or type <code>projects &lt;name&gt;</code> for detail.</p>`
    );
  },
};

function detail(all, slug, ctx) {
  const p = all.find(x => x.slug === slug.toLowerCase());

  if (!p) {
    const names = all.map(x => cmdLink(`projects ${x.slug}`, x.slug)).join(" ");
    return ctx.write(
      `<span class="err">No project called ${escapeHtml(slug)}.</span>` +
      `<div class="chips">${names}</div>`
    );
  }

  const bullets = p.highlights.length
    ? `<ul class="bullets">${p.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join("")}</ul>`
    : "";

  ctx.write(
    section(p.name) +
    `<p class="stack">${escapeHtml(p.stack.join(" · "))} &nbsp;${badge(p.status.toUpperCase(), p.status)}</p>` +
    `<p>${escapeHtml(p.what)}</p>` +
    `<p class="hard"><b>Hard part:</b> ${escapeHtml(p.hard)}</p>` +
    bullets +
    `<p>${p.repo ? link(p.repo, "source →") : ""} ${p.demo ? link(p.demo, "demo →") : ""}</p>` +
    `<p class="muted">Back to ${cmdLink("projects")}</p>`
  );
}