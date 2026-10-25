import logo from "../logo.svg";
import { useNews, type NewsArticle } from "../Components/useNews";

const IMPORTANCE_STYLES: Record<string, string> = {
  Informational: "border-accent-border text-text-accent",
  Warning: "border-warning/60 text-warning",
  Critical: "border-danger/60 text-danger",
};

/** Renders inline `**bold**` and `` `code` `` spans. */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-text-h">
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

/** Light markdown renderer: bullet lines, bold and inline code. */
function ArticleContent({ content }: { content: string }) {
  return (
    <div className="space-y-1.5 text-sm text-text-l">
      {content.split("\n").map((line, i) => {
        if (line.trim() === "") return null;
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2">
              <span className="text-description" aria-hidden="true">
                •
              </span>
              <span>{renderInline(line.slice(2), `l${i}`)}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(line, `l${i}`)}</p>;
      })}
    </div>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const badge =
    IMPORTANCE_STYLES[article.importance] ?? IMPORTANCE_STYLES.Informational;

  return (
    <article
      tabIndex={0}
      className="group relative min-h-36 rounded-lg border border-border bg-bg-dark p-5 outline-none transition-colors focus-visible:border-accent-border"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-text-h">
          {article.title}
        </h3>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${badge}`}
        >
          {article.importance}
        </span>
      </div>
      <p className="mt-2 text-sm text-text-l">{article.contentSummary}</p>
      <p className="description mt-3">
        {article.author} · {new Date(article.createdAt).toLocaleDateString()}
      </p>

      <div className="pointer-events-none absolute inset-0 flex flex-col gap-2 overflow-y-auto rounded-lg bg-bg-darker p-5 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <h3 className="text-base font-semibold text-text-h">
          {article.title}
        </h3>
        <ArticleContent content={article.content} />
      </div>
    </article>
  );
}

export function HeroPage() {
  const news = useNews();

  return (
    <>
      <section className="w-full h-[40vh] bg-bg-dark">
        <div className="mx-auto flex flex-col gap-2 h-full max-w-5xl items-start justify-end p-4 py-8">
          <h1 className="text-4xl!">ETS2LA</h1>
          <p>Self-driving, maps, privacy focused dashcams, and more for SCS Truck Simulators.</p>
        
          <div className="my-2 flex flex-wrap items-center justify-center gap-3">
            <a href="#/download" className="button button-accent">
              Download For Free
            </a>
            <a
              href="https://docs.ets2la.com"
              target="_blank"
              rel="noreferrer"
              className="button"
            >
              Developer Docs
            </a>
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        {news.status === "loading" && (
          <section className="pb-16">
            <div className="mb-4 h-6 w-32 animate-pulse rounded bg-bg-dark" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="h-32 animate-pulse rounded-lg bg-bg-dark" />
              <div className="h-32 animate-pulse rounded-lg bg-bg-dark" />
            </div>
          </section>
        )}

        {news.status === "ready" && news.articles.length > 0 && (
          <section className="pb-16">
            <h2 className="mb-4 text-lg font-semibold text-text-h">
              Latest news
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {news.articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <p className="description mt-4">Served from {news.source}</p>
          </section>
        )}
      </div>
    </>
  );
}
