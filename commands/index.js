/**
 * Command registry.
 *
 * To add a command: create the file, import it, add it to the array.
 * `help`, `ls`, and tab completion all read from here.
 */

import about      from "./about.js";
import projects   from "./projects.js";
import experience from "./experience.js";
import education  from "./education.js";
import skills     from "./skills.js";
import contact    from "./contact.js";
import help       from "./help.js";
import ls         from "./ls.js";
import clear      from "./clear.js";

const commands = [about, projects, experience, education, skills, contact, help, ls, clear];

export const registry = new Map();
for (const cmd of commands) {
  registry.set(cmd.name, cmd);
  for (const a of cmd.aliases ?? []) registry.set(a, cmd);
}

/** Non-hidden commands, for help and ls. */
export const visible = () => commands.filter(c => !c.hidden);

/** Canonical names matching a prefix. Aliases excluded on purpose —
    completing to an alias teaches the wrong name. */
export function complete(prefix) {
  return visible()
    .map(c => c.name)
    .filter(n => n.startsWith(prefix));
}

/** Closest command by edit distance, or null if nothing is close enough. */
export function suggest(input) {
  const word = input.toLowerCase();
  let best = null, bestScore = Infinity;

  for (const name of visible().map(c => c.name)) {
    const d = distance(word, name);
    if (d < bestScore) { bestScore = d; best = name; }
  }
  return bestScore <= 2 ? best : null;
}

/* Levenshtein. Two rows instead of a full matrix — same result, less memory,
   and it's the version worth remembering. */
function distance(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,                                   // deletion
        curr[j - 1] + 1,                               // insertion
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)  // substitution
      );
    }
    prev = curr;
  }
  return prev[b.length];
}