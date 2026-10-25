import "./index.css";
import { HeaderBar } from "./Components/HeaderBar";
import { FooterBar } from "./Components/FooterBar";
import { DownloadPage } from "./Pages/DownloadPage";
import { useRoute } from "./Components/useRoute";

export function App() {
  const route = useRoute();

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderBar active={route === "download" ? "download" : undefined} />
      <main className="flex-1">
        {route === "download" ? <DownloadPage /> : null}
      </main>
      <FooterBar />
    </div>
  );
}

export default App;
