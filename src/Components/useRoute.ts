import { useEffect, useState } from "react";

/** Normalizes `#/docs/` -> "docs", `#/` -> "". */
function readPath(): string {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash.replace(/\/+$/, "");
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
