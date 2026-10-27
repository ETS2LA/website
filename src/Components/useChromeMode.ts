import { useEffect, useState } from "react";

/**
 * How much of the site chrome to show, chosen by query parameter.
 *
 * - `full` (default) - header and footer.
 * - `headerless` - `?headerless`; hides the header, keeps the footer.
 * - `clean` - `?clean`; hides both, for a frameless embed.
 *
 * The parameter goes before the `#` (`?clean#/help/faq`) so it survives
 * in-page navigation, which is hash-based.
 *
 * Read once on mount, like the router: the query string doesn't change while
 * the app is running.
 */
export type ChromeMode = "full" | "headerless" | "clean";

export function useChromeMode(): ChromeMode {
  const [mode, setMode] = useState<ChromeMode>("full");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("clean")) {
      setMode("clean");
    } else if (params.has("headerless")) {
      setMode("headerless");
    }
  }, []);

  return mode;
}
