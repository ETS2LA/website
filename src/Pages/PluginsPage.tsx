import { useMemo, useState } from "react";
import { usePlugins, type Plugin, type PluginVersion } from "../Components/usePlugins";
import { MarkdownText } from "../Components/Markdown";

/** `AIAssisted` -> "AI Assisted", `GodspeedLib` -> "Godspeed Lib". */
function classnameWithSpaces(value: string) {
  return value
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
}

/** Zebra-stripes the tag list so adjacent tags don't share a colour. */
const TAG_BG = ["bg-control-bg", "bg-control-bg-dark"];

function PluginCard({
  plugin,
  preferChina,
}: {
  plugin: Plugin;
  preferChina: boolean;
}) {
  const versions = plugin.versions;
  const [versionIndex, setVersionIndex] = useState(versions.length - 1);
  const selected: PluginVersion | undefined = versions[versionIndex];

  return (
    <div className="flex flex-col justify-between rounded-sm bg-control-bg-dark border border-bg-darker p-4 transition-colors hover:border-accent-dark">
      <div className="flex w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex w-full justify-between gap-3">
            <div className="flex flex-col gap-0">
              <p className="font-semibold">{plugin.name}</p>
              <p className="text-[12px]">By {plugin.author}</p>
            </div>
            <div className="flex flex-col gap-0 items-end min-w-fit">
              <span className="description text-[12px]">
                {versions.length} version{versions.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <p className="description">{plugin.description}</p>
        </div>
      </div>

      <div className="flex justify-between items-center gap-3 mt-2">
        <div className="flex flex-wrap items-center gap-2">
          {plugin.tags.map((tag, i) => (
            <span
              key={tag}
              className={`${TAG_BG[i % TAG_BG.length]} rounded-sm text-[12px] p-1`}
            >
              {classnameWithSpaces(tag)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PluginsPage() {
  const plugins = usePlugins();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const list = plugins.status === "ready" ? plugins.plugins : [];
  const preferChina =
    plugins.status === "ready" && plugins.source.includes(".cn");

  const tags = useMemo(
    () => [...new Set(list.flatMap((p) => p.tags))].sort(),
    [list],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [list, query, activeTag]);

  return (
    <>
      <section className="w-full h-[40vh] bg-bg">
        <div className="mx-auto flex flex-col gap-2 h-full max-w-5xl items-start justify-end p-4 py-8">
          <h1 className="text-4xl!">Plugins</h1>
          <p className="max-w-2xl">
            Here you'll find the currently available plugins for ETS2LA.
            These are either made by us, or the community. You can download
            them inside ETS2LA.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pt-10">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plugins..."
            className="flex-1 min-w-56 rounded-sm border border-bg-darker bg-control-bg-dark px-3 py-2 text-sm outline-none transition-colors placeholder:text-description focus:border-accent-dark"
          />

          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`rounded-sm border px-3 py-1.5 text-[12px] transition-all ${
              activeTag === null
                ? "border-accent-dark text-text-h"
                : "border-bg-darker text-text-l hover:border-accent-dark"
            }`}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-sm border px-3 py-1.5 text-[12px] transition-all ${
                activeTag === tag
                  ? "border-accent-dark text-text-h"
                  : "border-bg-darker text-text-l hover:border-accent-dark"
              }`}
            >
              {classnameWithSpaces(tag)}
            </button>
          ))}
        </div>

        {plugins.status === "loading" && (
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(27rem,1fr))] gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-sm bg-control-bg-dark"
              />
            ))}
          </div>
        )}

        {plugins.status === "error" && (
          <p className="description mt-6">
            Could not load the plugin list. Please try again later.
          </p>
        )}

        {plugins.status === "ready" && (
          <>
            {filtered.length === 0 ? (
              <p className="description mt-6">No plugins found.</p>
            ) : (
              <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(27rem,1fr))] gap-4">
                {filtered.map((plugin) => (
                  <PluginCard
                    key={plugin.id}
                    plugin={plugin}
                    preferChina={preferChina}
                  />
                ))}
              </div>
            )}

            <p className="description mt-4">Downloads available through ETS2LA.</p>
          </>
        )}
      </div>
    </>
  );
}
