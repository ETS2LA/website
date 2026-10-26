import { Fragment, type ReactNode } from "react";

/** Renders inline `**bold**` and `` `code` `` spans. */
export function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-text-l">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded bg-code-bg px-1 py-0.5 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

/**
 * Light markdown renderer: line breaks, bullets, bold and inline code.
 * Single newlines / `<br>` become inline breaks; blank lines separate
 * paragraphs.
 */
export function MarkdownText({ content }: { content: string }) {
  const normalized = content
    .replace(/\r\n?/g, "\n")
    .replace(/<br\s*\/?><br\s*\/?>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "remove");

  const paragraphs = normalized.split(/\n{2,}/);

  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split("\n").filter((line) => line.trim() !== "");
        if (lines.length === 0) return null;

        return (
          <p key={pIndex}>
            {lines.map((line, lIndex) => {
              if (line === "remove") return null;
              const bullet = line.startsWith("- ");
              const text = bullet ? line.slice(2) : line;

              return (
                <Fragment key={lIndex}>
                  {lIndex > 0 && <br />}
                  {bullet && (
                    <span className="text-description" aria-hidden="true">
                      •{" "}
                    </span>
                  )}
                  {renderInline(text, `p${pIndex}l${lIndex}`)}
                </Fragment>
              );
            })}
          </p>
        );
      })}
    </>
  );
}
