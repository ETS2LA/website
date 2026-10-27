import "./index.css";
import { HeaderBar } from "./Components/HeaderBar";
import { FooterBar } from "./Components/FooterBar";
import { HeroPage } from "./Pages/HeroPage";
import { DownloadPage } from "./Pages/DownloadPage";
import { PluginsPage } from "./Pages/PluginsPage";
import { HelpPage } from "./Pages/HelpPage";
import { MarkdownPage } from "./Pages/MarkdownPage";
import { AccountPage } from "./Pages/AccountPage";
import { AuthProvider } from "./Components/useAuth";
import { useRoute } from "./Components/useRoute";
import { useDocumentTitle } from "./Components/useDocumentTitle";
import { useChromeMode } from "./Components/useChromeMode";

const PAGE_TITLES: Record<string, string> = {
  download: "Download",
  plugins: "Plugins",
  account: "Account",
};

export function App() {
  const route = useRoute();
  const [path = "", section = ""] = route.split("#");
  const helpSlug = path.startsWith("help/") ? path.slice("help/".length) : "";

  // `?headerless` hides the header, `?clean` hides the footer too.
  const chrome = useChromeMode();
  const showHeader = chrome === "full";
  const showFooter = chrome !== "clean";

  // Markdown-backed routes (help, legal) set their own title from the markdown
  // heading, so they pass `null` and leave it alone until the page loads.
  const isMarkdownRoute =
    path.startsWith("help") || path.startsWith("legal/");
  useDocumentTitle(
    isMarkdownRoute ? null : (PAGE_TITLES[path] ?? ""),
  );

  return (
    <AuthProvider>
      <div
        className={`flex min-h-screen flex-col bg-bg-dark ${chrome === "clean" ? "clean-mode" : ""}`}
      >
        {showHeader && <HeaderBar active={path.split("/")[0] ?? ""} />}
        <main className="flex-1">
          {path === "download" ? (
            <DownloadPage />
          ) : path === "plugins" ? (
            <PluginsPage />
          ) : path === "account" ? (
            <AccountPage />
          ) : path.startsWith("legal/") ? (
            <MarkdownPage endpoint={`api/${path}.json`} section={section} />
          ) : path === "help" || path.startsWith("help/") ? (
            <HelpPage slug={helpSlug} section={section} />
          ) : (
            <HeroPage />
          )}
          <br/>
        </main>
        {showFooter && <FooterBar />}
      </div>
    </AuthProvider>
  );
}

export default App;
