import "./index.css";
import { HeaderBar } from "./Components/HeaderBar";
import { FooterBar } from "./Components/FooterBar";
import { HeroPage } from "./Pages/HeroPage";
import { DownloadPage } from "./Pages/DownloadPage";
import { PluginsPage } from "./Pages/PluginsPage";
import { HelpPage } from "./Pages/HelpPage";
import { AccountPage } from "./Pages/AccountPage";
import { AuthProvider } from "./Components/useAuth";
import { useRoute } from "./Components/useRoute";

export function App() {
  const route = useRoute();
  const [helpPath = "", helpSection = ""] = route.split("#");
  const helpSlug = helpPath.startsWith("help/")
    ? helpPath.slice("help/".length)
    : "";

  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-bg-dark">
        <HeaderBar active={route.split("/")[0] ?? ""} />
        <main className="flex-1">
          {route === "download" ? (
            <DownloadPage />
          ) : route === "plugins" ? (
            <PluginsPage />
          ) : route === "account" ? (
            <AccountPage />
          ) : route === "help" || route.startsWith("help/") ? (
            <HelpPage slug={helpSlug} section={helpSection} />
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
