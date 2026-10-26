import { Marked } from "marked";
import { readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Markdown content pipeline, shared by the dev server (`src/index.ts`) and the
 * static pre-render step (`scripts/prerender.ts`). Kept free of `serve` and
 * `index.html` so it can be imported from a plain Bun script.
 */

/** `Install the plugin!` -> "install-the-plugin" */
export function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** `__HELPHREF__` is replaced with the current page's help URL per page. */
const md = new Marked({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const id = slugify(text);
      return `<h${depth} id="${id}"><a class="help-anchor" href="__HELPHREF__#${id}" aria-label="Link to this section">#</a>${text}</h${depth}>\n`;
    },
  },
});

export type HelpPage = {
  slug: string;
  title: string;
  html: string;
  /** Position from the filename sort (numeric prefixes order the list). */
  index: number;
};

export type HelpSummary = { slug: string; title: string };

export function summarize(pages: HelpPage[]): HelpSummary[] {
  return pages.map(({ slug, title }) => ({ slug, title }));
}

/**
 * Removes HTML comments. `marked` passes raw HTML through untouched, so
 * authoring notes would otherwise ship to the client in the page source.
 */
export function stripComments(markdown: string): string {
  return markdown.replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Renders an alert callout (`> [!TIP]`) to a styled block. Must run on the
 * raw markdown; everything else is left to `marked`.
 */
export function renderAlerts(markdown: string): string {
  // Styled by `.help-alert-*` rules in index.css — Tailwind can't see classes
  // that only exist in this server-side file.
  const kinds = new Set(["NOTE", "TIP", "WARNING", "CAUTION"]);

  // Normalize CRLF so the line matcher below (`.` excludes `\r`) works.
  return markdown
    .replace(/\r\n?/g, "\n")
    .replace(
      /^>\s*\[!(\w+)\]\s*\n((?:>[^\n]*\n?)*)/gm,
      (_match, type: string, body: string) => {
        const kind = type.toUpperCase();
        const tone = kinds.has(kind) ? kind.toLowerCase() : "note";
        const content = body.replace(/^>\s?/gm, "").trim();
        const inner = md.parse(content) as string;
        return `<div class="help-alert help-alert-${tone}">${inner}</div>\n\n`;
      },
    );
}

/**
 * `getting-started.md` -> "getting-started"
 * `01-index.md` -> "" (numeric prefixes order the list, not the slug)
 */
export function slugFor(file: string): string {
  const name = file.replace(/\.md$/, "").replace(/^\d+[-_]/, "");
  return name === "index" ? "" : name;
}

/**
 * Loads markdown pages from a folder at the repo root. Files are ordered by
 * filename, so a numeric prefix (`01-foo.md`) controls the order without
 * affecting the slug. `index.md` is pinned first and maps to the folder root.
 */
export async function loadMarkdownPages(
  folder: string,
  baseHref: string,
): Promise<HelpPage[]> {
  const dir = path.join(process.cwd(), folder);
  let files: string[];
  try {
    files = await readdir(dir);
  } catch {
    return []; // folder doesn't exist yet
  }

  const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();

  const pages = await Promise.all(
    markdownFiles.map(async (file, index) => {
      const slug = slugFor(file);
      const markdown = await Bun.file(path.join(dir, file)).text();
      const title =
        markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file.replace(/\.md$/, "");

      const href = slug === "" ? baseHref : `${baseHref}/${slug}`;
      // Bare in-page anchors (`[text](#some-heading)`) must carry the page
      // route too, otherwise the hash router reads `#some-heading` as a new
      // route. Links that already start with a route (`](#/download)`) are
      // left alone.
      const withRouteLinks = markdown.replace(
        /\]\(#([^)/][^)]*)\)/g,
        "](__HELPHREF__#$1)",
      );
      const html = (
        md.parse(renderAlerts(stripComments(withRouteLinks))) as string
      ).replaceAll("__HELPHREF__", href);

      // Drop the leading <h1>: the page already renders the title in the hero.
      const withoutTitle = html.replace(/^\s*<h1\b[^>]*>.*?<\/h1>/, "").trim();

      return { slug, title, html: withoutTitle, index };
    }),
  );

  // Sorted by filename (prefixes), with the index page pinned to the front.
  return pages.sort((a, b) => {
    if (a.slug === "") return -1;
    if (b.slug === "") return 1;
    return a.index - b.index;
  });
}

export async function loadHelpPages(): Promise<HelpPage[]> {
  return loadMarkdownPages("help", "#/help");
}

/**
 * Finds a page by slug; `index` is an alias for the help root (""). If there's
 * no index page, the first page is used so `#/help` always resolves.
 */
export async function loadHelpPage(
  slug: string,
): Promise<HelpPage | undefined> {
  const wanted = slug === "index" ? "" : slug;
  const pages = await loadHelpPages();
  return (
    pages.find((page) => page.slug === wanted) ??
    (wanted === "" ? pages[0] : undefined)
  );
}

export async function loadLegalPage(
  slug: string,
): Promise<HelpPage | undefined> {
  const pages = await loadMarkdownPages("legal", "#/legal");
  return pages.find((page) => page.slug === slug);
}
