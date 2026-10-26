import { useEffect, useState } from "react";

/**
 * Normalizes the hash into a route, keeping any `#section` suffix:
 * `#/docs/` -> "docs", `#/help/faq#setup` -> "help/faq#setup".
 */
function readPath(): string {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [route, section] = hash.split("#");
  const trimmed = (route ?? "").replace(/\/+$/, "");
  return section ? `${trimmed}#${section}` : trimmed;
}

/** Minimal hash-based router: returns the current path, e.g. "download". */
export function useRoute(): string {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onChange = () => setPath(readPath());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return path;
}
