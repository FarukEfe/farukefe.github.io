import { createTerminal } from "./terminal.js";
import { boot } from "./boot.js";

const SECTIONS = ["about", "projects", "skills", "experience", "education", "contact"];

async function loadContent() {
  // one round trip, all in parallel — not a waterfall
  const files = await Promise.all(
    SECTIONS.map(name =>
      fetch(`./content/${name}.json`).then(r => r.json())
    )
  );
  return Object.fromEntries(SECTIONS.map((name, i) => [name, files[i]]));
}

async function main() {
  const content = await loadContent();

  const term = createTerminal({
    root:  document.getElementById("scrollback"),
    input: document.getElementById("input"),
    content,
  });

  await boot(term);
}

main();