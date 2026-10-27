import { useState } from "react";

type SourceId = "global" | "cn";

type Source = {
  label: string;
  note?: string;
  releasesUrl: string;
  assetBase: string;
  host: string;
};

type PlatformId = "windows" | "linux";

type Platform = {
  id: PlatformId;
  os: string;
  file: string;
  detail?: string;
};

const SOURCES: Record<SourceId, Source> = {
  global: {
    label: "Global",
    note: "This is the default source for all users outside China. You will install and update from GitHub.",
    releasesUrl: "https://github.com/ETS2LA/ETS2LA/releases",
    assetBase: "https://github.com/ETS2LA/ETS2LA/releases/latest",
    host: "github.com",
  },
  cn: {
    label: "Chinese Mainland",
    note: "Only Chinese Mainland users should use this mirror. Installs from this mirror will prefer the Chinese repository when updating, as well as the Chinese mirrors of our APIs.",
    releasesUrl: "https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/-/releases",
    assetBase:
      "https://cnb.cool/ETS2LA-CN/Euro-Truck-Simulator-2-Lane-Assist/-/releases/latest",
    host: "cnb.cool",
  },
};

const PLATFORMS: Platform[] = [
  {
    id: "windows",
    os: "Windows",
    file: "ETS2LA-win-release.msi"
  },
  {
    id: "linux",
    os: "Linux",
    file: "ETS2LA-linux-release.AppImage",
    detail: "This .AppImage requires GLIBC 2.43 to run. If your distribution doesn't include it, please build from source.",
  },
];

function detectOS(): PlatformId | null {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return "linux";
  return null;
}

/** Shared card surface, matching the news cards on the home page. */
const CARD_BG = "bg-control-bg-dark";

/** `${assetBase}/download/${file}` apparently works on both GitHub and CNB. */
function downloadUrl(source: Source, file: string) {
  return `${source.assetBase}/download/${file}`;
}

export function DownloadPage() {
  const [sourceId, setSourceId] = useState<SourceId>("global");
  const [os] = useState<PlatformId | null>(detectOS);
  const source = SOURCES[sourceId];

  const recommended = PLATFORMS.find((p) => p.id === os) ?? null;

  return (
    <>
      <section className="page-hero w-full h-[40vh] bg-bg">
        <div className="mx-auto flex flex-col gap-2 h-full max-w-5xl items-start justify-end p-4 py-8">
          <h1 className="text-4xl!">Download ETS2LA</h1>
          <p className="max-w-2xl">Choose a download source below. Please note that only the latest release is available here, for historical releases please visit the release page of the selected source.</p>
        </div>
      </section>

      <div className="page-shell mx-auto w-full max-w-5xl px-4 pt-10">
        <div
          role="radiogroup"
          aria-label="Download source"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
        >
          {(Object.keys(SOURCES) as SourceId[]).map((id) => {
            const item = SOURCES[id];
            const selected = id === sourceId;

            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setSourceId(id)}
                className={`flex flex-col w-full text-left rounded-sm border p-4 transition-all outline-none ${CARD_BG} ${
                  selected
                    ? "border-accent-dark"
                    : "border-bg-darker hover:border-accent-dark"
                }`}
              >
                <span className="font-semibold text-text-h">{item.label}</span>
                <span className="description mt-1">
                  Downloads are served from {item.host}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 rounded-sm border border-bg-darker bg-control-bg-dark p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="description text-[14px]">
              Downloads are served from{" "}
              <span className="font-semibold text-text-l">{source.host}</span>
            </p>

            <a
              href={source.releasesUrl}
              target="_blank"
              rel="noreferrer"
              className="description"
            >
              View all releases
            </a>
          </div>

          <a
            href={
              recommended ? downloadUrl(source, recommended.file) : source.assetBase
            }
            className="mt-4 flex w-full! items-center justify-between gap-3 rounded-sm border border-accent-dark bg-accent-dark/30 px-4 py-3 transition-colors hover:bg-accent-dark/50"
          >
            <span className="font-semibold text-text-h">
              {recommended
                ? `Download for ${recommended.os}`
                : "Download latest release"}
            </span>
            <div className="flex gap-2">
              {recommended && (
                <span className="description">
                  {recommended.file}
                </span>
              )}
            </div>
          </a>

          {source.note && (
            <p className="description mt-3 rounded-sm border border-bg-darker bg-bg-dark px-3 py-2">
              {source.note}
            </p>
          )}

          {recommended && recommended.detail && (
            <p className="description mt-3">
              {recommended.detail}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
