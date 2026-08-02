/**
 * Wipes the scrollback. The keyboard shortcut Ctrl-L does the same thing;
 * this is the typed form, for muscle memory and for touch users with no
 * modifier keys.
 */

export default {
  name: "clear",
  desc: "clear the screen",
  aliases: ["cls"],

  run(args, ctx) {
    ctx.clear();
  },
};
