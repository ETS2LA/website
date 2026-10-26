import { serve } from "bun";
import index from "./index.html";
import {
  loadHelpPage,
  loadHelpPages,
  loadLegalPage,
  summarize,
} from "./content";

const server = serve({
  routes: {
    /**
     * Help content is served from markdown files in `help/`. Drop a `.md`
     * file there and it becomes available at `#/help/<filename>`.
     */
    "/api/help.json": {
      async GET() {
        return Response.json({ pages: summarize(await loadHelpPages()) });
      },
    },

    // `:slug` can't be used here: Bun parses `:slug.json` as a param literally
    // named "slug.json". A wildcard keeps the extension, which we strip below.
    "/api/help/*": {
      async GET(req) {
        const slug = decodeURIComponent(
          new URL(req.url).pathname.replace(/^\/api\/help\//, "").replace(/\.json$/, ""),
        );
        const page = await loadHelpPage(slug);
        if (!page) {
          return Response.json({ error: "Page not found" }, { status: 404 });
        }
        const { slug: found, title, html } = page;
        return Response.json({
          slug: found,
          title,
          html,
          pages: summarize(await loadHelpPages()),
        });
      },
    },

    /**
     * Legal pages (privacy policy, terms, ...) come from markdown files in
     * `legal/` and are served at `#/legal/<filename>`.
     */
    "/api/legal/*": {
      async GET(req) {
        const slug = decodeURIComponent(
          new URL(req.url).pathname.replace(/^\/api\/legal\//, "").replace(/\.json$/, ""),
        );
        const page = await loadLegalPage(slug);
        if (!page) {
          return Response.json({ error: "Page not found" }, { status: 404 });
        }
        const { slug: found, title, html } = page;
        return Response.json({ slug: found, title, html });
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
