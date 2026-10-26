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

export function App() {
  const route = useRoute();
  const [path = "", section = ""] = route.split("#");
  const helpSlug = path.startsWith("help/") ? path.slice("help/".length) : "";

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-bg-dark">
        <HeaderBar active={path.split("/")[0] ?? ""} />
        <main className="flex-1">
          {path === "download" ? (
            <DownloadPage />
          ) : path === "plugins" ? (
            <PluginsPage />
          ) : path === "account" ? (
            <AccountPage />
          ) : path.startsWith("legal/") ? (
            <MarkdownPage endpoint={`/api/${path}`} section={section} />
          ) : path === "help" || path.startsWith("help/") ? (
            <HelpPage slug={helpSlug} section={section} />
          ) : (
            <HeroPage />
          )}
          <br/>
        </main>
        <FooterBar />
      </div>
    </AuthProvider>
  );
}

export default App;
