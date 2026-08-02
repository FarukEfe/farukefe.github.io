/**
 * The terse cousin of `help` — just the names, as clickable chips. What you
 * reach for when you know the place and only need the door.
 */

import { chips } from "../render.js";
import { visible } from "./index.js";

export default {
  name: "ls",
  desc: "list command names",
  aliases: ["dir"],

  run(args, ctx) {
    ctx.write(chips(visible().map(c => c.name)));
  },
};
