import { useEffect, useRef, useState } from "react";
import { useSectionFocus } from "../Components/useSectionFocus";
import { useDocumentTitle } from "../Components/useDocumentTitle";

type HelpSummary = { slug: string; title: string };

type HelpResponse = {
  slug: string;
  title: string;
  html: string;
  pages: HelpSummary[];
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: HelpResponse };

/**
 * Renders a help page from `#/help/<slug>`. Content comes from markdown files
 * in the repository's `help/` folder. `section` is an optional heading anchor
 * (`#/help/faq#supported-versions`).
 */
export function HelpPage({
  slug,
  section,
}: {
  slug: string;
  section: string;
}) {
  const [state, setState] = useState<State>({ status: "loading" });
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    // The index page lives at `index.md`, requested as `api/help/index.json`.
    const apiSlug = slug === "" ? "index" : slug;
    fetch(`api/help/${encodeURIComponent(apiSlug)}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<HelpResponse>;
      })
      .then((data) => active && setState({ status: "ready", data }))
      .catch(() => active && setState({ status: "error" }));

    return () => {
      active = false;
    };
  }, [slug]);

  useSectionFocus(
    articleRef,
    section,
    state.status === "ready",
    state.status === "ready" ? state.data.slug : "",
  );

  useDocumentTitle(
    state.status === "ready" ? state.data.title : "Help",
  );

  const pages = state.status === "ready" ? state.data.pages : [];

  return (
    <>
      <section className="page-hero w-full h-[40vh] bg-bg">
        <div className="mx-auto flex flex-col gap-2 h-full max-w-5xl items-start justify-end p-4 py-8">
          <h1 className="text-4xl!">
            {state.status === "ready" ? state.data.title : "Help"}
          </h1>
          <p className="max-w-2xl">
            Guides and answers for installing and using ETS2LA.
          </p>
        </div>
      </section>

      <div className="page-shell mx-auto w-full max-w-5xl px-4 pt-10">
        {pages.length > 0 && (
          <nav className="mb-6 flex flex-wrap items-center gap-2">
            {pages.map((page) => (
              <a
                key={page.slug}
                href={page.slug === "" ? "#/help" : `#/help/${page.slug}`}
                className={`rounded-sm border px-3 py-1.5 text-[12px] transition-all ${
                  page.slug === slug
                    ? "border-accent-dark text-text-h"
                    : "border-bg-darker text-text-l hover:border-accent-dark"
                }`}
              >
                {page.title}
              </a>
            ))}
          </nav>
        )}

        {state.status === "loading" && (
          <div className="space-y-3">
            <div className="h-6 w-1/3 animate-pulse rounded bg-control-bg-dark" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-control-bg-dark" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-control-bg-dark" />
          </div>
        )}

        {state.status === "error" && (
          <p className="description">
            Could not load this help page. It may have been moved or removed.
          </p>
        )}

        {state.status === "ready" && (
          <article
            ref={articleRef}
            className="help-content mt-10"
            // Content is authored by us in the repository's help/*.md files.
            dangerouslySetInnerHTML={{ __html: state.data.html }}
          />
        )}
      </div>
    </>
  );
}
