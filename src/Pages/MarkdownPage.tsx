import { useEffect, useRef, useState } from "react";
import { useSectionFocus } from "../Components/useSectionFocus";
import { useDocumentTitle } from "../Components/useDocumentTitle";

/**
 * Renders a markdown-backed page. `endpoint` is an API path like
 * `/api/help/faq`; the response supplies the title and rendered HTML.
 * `section` is an optional heading anchor, as in `#/legal/privacy#summary`.
 */
export function MarkdownPage({
  endpoint,
  section = "",
}: {
  endpoint: string;
  section?: string;
}) {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; title: string; html: string }
  >({ status: "loading" });
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<{ title: string; html: string }>;
      })
      .then((data) => active && setState({ status: "ready", ...data }))
      .catch(() => active && setState({ status: "error" }));

    return () => {
      active = false;
    };
  }, [endpoint]);

  useSectionFocus(
    articleRef,
    section,
    state.status === "ready",
    state.status === "ready" ? state.title : "",
  );

  useDocumentTitle(state.status === "ready" ? state.title : "");

  if (state.status === "loading") {
    return (
      <div className="page-shell mx-auto w-full max-w-5xl px-4 py-12">
        <div className="space-y-3">
          <div className="h-7 w-1/3 animate-pulse rounded bg-control-bg-dark" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-control-bg-dark" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-control-bg-dark" />
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="page-shell mx-auto w-full max-w-5xl px-4 py-12">
        <p className="description">
          Could not load this page. It may have been moved or removed.
        </p>
      </div>
    );
  }

  return (
    <div className="page-shell mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold text-text-h">{state.title}</h1>
      <article
        ref={articleRef}
        className="help-content mt-4"
        // Content is authored by us in the repository's markdown files.
        dangerouslySetInnerHTML={{ __html: state.html }}
      />
    </div>
  );
}
