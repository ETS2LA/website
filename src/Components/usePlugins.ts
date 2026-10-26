import { useEffect, useState } from "react";

export type PluginDownloadUrl = {
  Global?: string;
  China?: string;
};

export type PluginVersion = {
  version: string;
  appVersion: string;
  changelog: string;
  dllPath: string;
  dependencies: string[];
  supportedOperatingSystems: string[];
  downloadUrl: PluginDownloadUrl;
};

export type Plugin = {
  id: string;
  author: string;
  name: string;
  description: string;
  websiteUrl: string;
  versions: PluginVersion[];
  tags: string[];
};

/** Plugin hosts, tried in order (`.com`, then the mainland `.cn` mirror). */
const PLUGIN_HOSTS = ["https://api.ets2la.com", "https://api.ets2la.cn"];

type PluginsState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; plugins: Plugin[]; source: string };

/** Plugin catalog from the ETS2LA API, with a `.cn` fallback. */
export function usePlugins(): PluginsState {
  const [state, setState] = useState<PluginsState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });

    (async () => {
      for (const host of PLUGIN_HOSTS) {
        try {
          const res = await fetch(`${host}/api/v1/plugins`);
          if (!res.ok) continue;
          const plugins = (await res.json()) as Plugin[];
          if (active) {
            setState({
              status: "ready",
              plugins,
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
