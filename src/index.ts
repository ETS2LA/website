import { serve } from "bun";
import { Marked } from "marked";
import { readdir } from "node:fs/promises";
import path from "node:path";
import index from "./index.html";

const HELP_DIR = path.join(process.cwd(), "help");

/** `Install the plugin!` -> "install-the-plugin" */
function slugify(text: string): string {
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

type HelpPage = {
  slug: string;
  title: string;
  html: string;
  /** Position from the filename sort (numeric prefixes order the list). */
  index: number;
};

type HelpSummary = { slug: string; title: string };

function summarize(pages: HelpPage[]): HelpSummary[] {
  return pages.map(({ slug, title }) => ({ slug, title }));
}

/**
 * Renders an alert callout (`> [!TIP]`) to a styled block. Must run on the
 * raw markdown; everything else is left to `marked`.
 */
function renderAlerts(markdown: string): string {
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
function slugFor(file: string): string {
  const name = file.replace(/\.md$/, "").replace(/^\d+[-_]/, "");
  return name === "index" ? "" : name;
}

async function loadHelpPages(): Promise<HelpPage[]> {
  let files: string[];
  try {
    files = await readdir(HELP_DIR);
  } catch {
    return []; // no help directory yet
  }

  const markdownFiles = files.filter((file) => file.endsWith(".md")).sort();

  const pages = await Promise.all(
    markdownFiles.map(async (file, index) => {
      const slug = slugFor(file);
      const markdown = await Bun.file(path.join(HELP_DIR, file)).text();
      const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? file.replace(/\.md$/, "");

      const helpHref = slug === "" ? "#/help" : `#/help/${slug}`;
      const html = (md.parse(renderAlerts(markdown)) as string).replaceAll(
        "__HELPHREF__",
        helpHref,
      );

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

/**
 * Finds a page by slug; `index` is an alias for the help root (""). If there's
 * no index page, the first page is used so `#/help` always resolves.
 */
async function loadHelpPage(slug: string): Promise<HelpPage | undefined> {
  const wanted = slug === "index" ? "" : slug;
  const pages = await loadHelpPages();
  return pages.find((page) => page.slug === wanted) ?? (wanted === "" ? pages[0] : undefined);
}

const server = serve({
  routes: {
    /**
     * Help content is served from markdown files in `help/`. Drop a `.md`
     * file there and it becomes available at `#/help/<filename>`.
     */
    "/api/help": {
      async GET() {
        return Response.json({ pages: summarize(await loadHelpPages()) });
      },
    },

    "/api/help/:slug": {
      async GET(req) {
        const page = await loadHelpPage(req.params.slug);
        if (!page) {
          return Response.json({ error: "Page not found" }, { status: 404 });
        }
        const { slug, title, html } = page;
        return Response.json({
          slug,
          title,
          html,
          pages: summarize(await loadHelpPages()),
        });
      },
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
