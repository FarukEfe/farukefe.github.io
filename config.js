/**
 * Environment differences. Kept tiny on purpose — if this file grows past
 * a screen, something belongs elsewhere.
 *
 * There are no secrets here. Anything shipped to a browser is public;
 * the GitHub token lives in Actions secrets and only ever runs in CI.
 */

const isDev = ["localhost", "127.0.0.1", "[::1]", ""].includes(location.hostname);

export const config = {
  isDev,

  /* The Action only writes static/github.json in CI, so locally you'd 404.
     Commit a sample file with realistically-shaped fake data or you can't
     develop the heatmap and repo table at all. */
  githubData: isDev
    ? "./content/github.sample.json"
    : "./static/github.json",

  /* Gate `debug`, `dump`, `throw` on this in commands/index.js and they
     simply don't exist in production. */
  debugCommands: isDev,

  /* Boot delays, in ms. Zeroed for anyone who asked for less motion —
     read once here so no other file has to think about it. */
  bootDelay: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180,

  /* Sections to load. main.js maps over this; adding a section means
     adding its name here and a content/<name>.json file. */
  sections: ["about", "projects", "skills", "experience", "education", "contact"],
};