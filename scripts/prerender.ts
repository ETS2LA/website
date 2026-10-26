/**
 * Generates the static JSON that the frontend fetches for markdown content.
 *
 * In development `src/index.ts` answers these routes on the fly. GitHub Pages
 * can't run that server, so this script bakes the same payloads into `dist/`
 * as real files:
 *
 *   dist/api/help.json           list of help pages (tabs)
 *   dist/api/help/<slug>.json    one help page
 *   dist/api/legal/<slug>.json   one legal page
 *
 * Run by `bun run build`, after `build.ts` has produced `dist/`.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import {
  loadHelpPage,
  loadHelpPages,
  loadMarkdownPages,
  summarize,
} from "../src/content";

const dist = path.join(process.cwd(), "dist");
const api = path.join(dist, "api");

/** Writes `data` as pretty JSON, creating parent folders. */
async function writeJson(file: string, data: unknown) {
  await mkdir(path.dirname(file), { recursive: true });
  await Bun.write(file, JSON.stringify(data, null, 2));
  console.log(` ${path.relative(process.cwd(), file)}`);
}

const helpPages = await loadHelpPages();
await writeJson(path.join(api, "help.json"), {
  pages: summarize(helpPages),
});

for (const { slug } of helpPages) {
  // The index page is served as `help/index.json` (see `HelpPage`).
  const file = slug === "" ? "index" : slug;
  const page = await loadHelpPage(file);
  await writeJson(path.join(api, "help", `${file}.json`), {
    slug: page!.slug,
    title: page!.title,
    html: page!.html,
    pages: summarize(helpPages),
  });
}

const legalPages = await loadMarkdownPages("legal", "#/legal");
for (const { slug, title, html } of legalPages) {
  await writeJson(path.join(api, "legal", `${slug}.json`), {
    slug,
    title,
    html,
  });
}
