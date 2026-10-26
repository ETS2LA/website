import { useEffect, useState, type RefObject } from "react";

/**
 * Scrolls to a heading anchor, highlights that section and dims the rest.
 *
 * `section` is the raw anchor from the URL (`#/help/faq#supported-versions` ->
 * "supported-versions"). `ready` gates the DOM work until the article has been
 * rendered, and `contentKey` re-runs it when a different page is loaded.
 *
 * The dimming is released on the first scroll or interaction, so it never
 * fights the reader once they start moving.
 */
export function useSectionFocus(
  articleRef: RefObject<HTMLElement | null>,
  section: string,
  ready: boolean,
  contentKey: string,
) {
  const [focused, setFocused] = useState(true);

  // Scroll to the requested heading once the content is in the DOM.
  useEffect(() => {
    if (!ready) return;
    const target = section
      ? document.getElementById(decodeURIComponent(section))
      : null;
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ready, section, contentKey]);

  // Highlight the shared section, then release the dimming on first interaction.
  useEffect(() => {
    setFocused(Boolean(section));
  }, [section]);

  useEffect(() => {
    if (!focused) return;
    const release = () => setFocused(false);
    const events = ["wheel", "keydown", "pointerdown", "touchstart"] as const;
    for (const event of events) {
      window.addEventListener(event, release, { passive: true });
    }
    return () => {
      for (const event of events) window.removeEventListener(event, release);
    };
  }, [focused]);

  // Dim everything except the shared section, and highlight its heading.
  useEffect(() => {
    const article = articleRef.current;
    if (!article || !ready) return;

    const children = [...article.children];
    const id = section ? decodeURIComponent(section) : "";
    const focusIndex = id ? children.findIndex((el) => el.id === id) : -1;

    // No anchor, or the anchor doesn't exist -> leave the page as-is.
    if (focusIndex < 0) {
      setFocused(false);
      return;
    }

    const level = Number(children[focusIndex]!.tagName[1] ?? 9);
    let end = children.length;
    for (let i = focusIndex + 1; i < children.length; i++) {
      const tag = children[i]!.tagName;
      if (/^H[1-4]$/.test(tag) && Number(tag[1]) <= level) {
        end = i;
        break;
      }
    }

    children.forEach((el, i) => {
      const inSection = i >= focusIndex && i < end;
      el.classList.toggle("help-dimmed", focused && !inSection);
      if (inSection && i === focusIndex) el.classList.add("help-highlighted");
    });

    return () => {
      article
        .querySelectorAll(".help-dimmed,.help-highlighted")
        .forEach((el) => el.classList.remove("help-dimmed", "help-highlighted"));
    };
  }, [focused, section, ready, contentKey]);
}
