import "./index.css";
import { HeaderBar } from "./Components/HeaderBar";
import { FooterBar } from "./Components/FooterBar";
import { HeroPage } from "./Pages/HeroPage";
import { DownloadPage } from "./Pages/DownloadPage";
import { PluginsPage } from "./Pages/PluginsPage";
import { HelpPage } from "./Pages/HelpPage";
import { useRoute } from "./Components/useRoute";

export function App() {
  const route = useRoute();
  const [helpPath = "", helpSection = ""] = route.split("#");
  const helpSlug = helpPath.startsWith("help/")
    ? helpPath.slice("help/".length)
    : "";

  return (
    <div className="flex min-h-screen flex-col bg-bg-dark">
      <HeaderBar active={route.split("/")[0] ?? ""} />
      <main className="flex-1">
        {route === "download" ? (
          <DownloadPage />
        ) : route === "plugins" ? (
          <PluginsPage />
        ) : route === "help" || route.startsWith("help/") ? (
          <HelpPage slug={helpSlug} section={helpSection} />
        ) : (
          <HeroPage />
        )}
        <br/>
      </main>
      <FooterBar />
    </div>
  );
}

export default App;
