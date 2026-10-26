import { useEffect } from "react";

const SITE = "ETS2LA";

/**
 * Sets the browser tab title, so each route reads as `<page> | ETS2LA`.
 *
 * Pass `""` for the site root, or `null` to leave the title untouched - used
 * by routes where a child page knows its own title but is still loading.
 */
export function useDocumentTitle(page: string | null) {
  useEffect(() => {
    if (page === null) return;
    document.title = page ? `${page} | ${SITE}` : SITE;
  }, [page]);
}
