import { useState } from "react";
import { useNews, type NewsArticle } from "../Components/useNews";
import { MarkdownText, renderInline } from "../Components/Markdown";

const IMPORTANCE_BG: Record<string, string> = {
  Critical: "bg-accent-dark/50",
  Warning: "bg-accent-dark/30",
};
const DEFAULT_BG = "bg-control-bg-dark";

/** `2026-10-24T10:56:14.370216Z` -> `24.10.2026 10:56` */
function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function NewsCard({ article }: { article: NewsArticle }) {
  const [expanded, setExpanded] = useState(false);
  const background = IMPORTANCE_BG[article.importance] ?? DEFAULT_BG;

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      tabIndex={0}
      className={`flex flex-col justify-between w-full ${background} border rounded-sm p-4 transition-all outline-none ${
        expanded ? "border-accent-dark" : "border-bg-darker"
      }`}
    >
      <p className="font-semibold">{renderInline(article.title, "t")}</p>

      <div
        className={`grid transition-all duration-150 ease-in-out ${
          expanded
            ? "grid-rows-[0fr] opacity-0"
            : "grid-rows-[1fr] opacity-100"
        }`}
      >
        <div className="overflow-hidden">
          <p className="description mt-1">
            {renderInline(article.contentSummary, "s")}
          </p>
        </div>
      </div>

      <div
        className={`grid transition-all duration-150 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-1 space-y-2 text-[12px] text-text-l/80">
            <MarkdownText content={article.content} />
          </div>
        </div>
      </div>

      {expanded ? (
        <p className="description mt-2">
          <span className="font-semibold">{article.author}</span>
          {article.expiresAt
            ? ` until ${formatDate(article.expiresAt)}`
            : ` at ${formatDate(article.createdAt)}`}
        </p>
      ) : (
        <p className="description mt-2 font-semibold">{article.author}</p>
      )}
    </div>
  );
}

export function HeroPage() {
  const news = useNews();

  return (
    <>
      <section className="w-full h-[40vh] bg-bg">
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
              className="button border-control/50!"
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {news.articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <p className="description mt-4">Also available inside ETS2LA.</p>
          </section>
        )}
      </div>
    </>
  );
}
