export function FooterBar() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full border-t border-border bg-bg-dark">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-text-l sm:flex-row">
        <span>© {year} ETS2LA Developers</span>

        <nav className="flex items-center gap-4">
          <a
            href="https://github.com/ETS2LA/ETS2LA"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-text-h"
          >
            GitHub
          </a>
          <a
            href="https://docs.ets2la.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-text-h"
          >
            Developer Documentation
          </a>
          <a
            href="#/legal/privacy"
            className="transition-colors hover:text-text-h"
          >
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
