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
  detail: string;
};

const SOURCES: Record<SourceId, Source> = {
  global: {
    label: "Global",
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
    file: "ETS2LA-win-release.msi",
    detail: "Requirements are included in the installer.",
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
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-semibold text-text-h">Download ETS2LA</h1>
      <p className="mt-3 max-w-prose text-text-l">
        Choose a download source below. Please note that only the latest release is available here, for historical releases please visit the release page of the selected source.
      </p>

      <div
        role="radiogroup"
        aria-label="Download source"
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
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
              className={`rounded-lg border p-4 text-left transition-colors flex flex-col ${
                selected
                  ? "border-accent-border bg-accent-darker"
                  : "border-border bg-bg-dark hover:bg-bg-darker"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-text-h">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-bg-dark p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            Downloads are served from{" "}
            <span className="text-text-h">{source.host}</span>
          </p>

          <a
            href={source.releasesUrl}
            target="_blank"
            rel="noreferrer"
            className="button button-small"
          >
            View all releases
          </a>
        </div>

        {source.note && (
          <p className="mt-4 rounded-md border border-border bg-bg-darker px-3 py-2 text-sm text-text-l">
            {source.note}
          </p>
        )}

        <a
          href={
            recommended ? downloadUrl(source, recommended.file) : source.assetBase
          }
          className="mt-5 flex w-full! justify-between gap-3 rounded-lg border button px-4 py-3 transition-colors"
        >
          <span className="flex flex-col gap-1">
            <span className="font-semibold text-text-h">
              {recommended
                ? `Download for ${recommended.os}`
                : "Download latest release"}
            </span>
          </span>
        </a>

        <p className="description mt-3">
          {recommended?.detail ?? "Please select your platform from the release page."}
        </p>
      </div>
    </div>
  );
}
