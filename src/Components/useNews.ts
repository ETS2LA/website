import { useEffect, useState } from "react";

export type NewsArticle = {
  id: string;
  title: string;
  contentSummary: string;
  content: string;
  author: string;
  imageUrl: string;
  importance: "Informational" | "Warning" | "Critical" | string;
  visible: boolean;
  createdAt: string;
  expiresAt: string | null;
};

const NEWS_HOSTS = ["https://api.ets2la.com", "https://api.ets2la.cn"];

type NewsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; articles: NewsArticle[]; source: string };

export function useNews(): NewsState {
  const [state, setState] = useState<NewsState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    (async () => {
      for (const host of NEWS_HOSTS) {
        try {
          const res = await fetch(`${host}/api/v1/news`);
          if (!res.ok) continue;
          const articles = (await res.json()) as NewsArticle[];
          if (active) {
            setState({
              status: "ready",
              articles: articles.filter((a) => a.visible),
              source: host.replace("https://", ""),
            });
          }
          return;
        } catch {
          // try the next host
        }
      }
      if (active) setState({ status: "error" });
    })();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
