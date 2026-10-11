/**
 * Wipes the scrollback. The keyboard shortcut Ctrl-L does the same thing;
 * this is the typed form, for muscle memory and for touch users with no
 * modifier keys. Leaves a single hint row so a visitor who clicked it by
 * accident isn't stranded on an empty screen.
 */

import { chips } from "../render.js";
import { visible } from "./index.js";

export default {
  name: "clear",
  desc: "clear the screen",
  aliases: ["cls"],

  run(args, ctx) {
    ctx.clear();
    ctx.write(
      `<p class="muted">Type a command, or click one:</p>` +
      chips(visible().filter(c => c.section).map(c => c.name))
    );
  },
};
