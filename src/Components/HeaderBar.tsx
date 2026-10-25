import logo from "../logo.svg";

type HeaderBarProps = {
  active: string;
};

const navItems = [
  { id: "docs", label: "Docs", href: "#/docs" },
  { id: "plugins", label: "Plugins", href: "#/plugins" },
] as const;

export function HeaderBar({ active }: HeaderBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg-dark/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4">
        <a
          href="#/"
          className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-bg"
        >
          <img src={logo} alt="ETS2LA" className="h-7 w-7" />
          <span className="text-base font-semibold text-text-h">ETS2LA</span>
        </a>

        <nav className="ml-2 flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-bg ${
                active === item.id
                  ? "text-text-h bg-bg"
                  : "text-text-l hover:text-text-h"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a
            href="#/account"
            className={`button button-small`}
          >
            Account
          </a>
          <a
            href="#/download"
            className={`button button-small button-accent`}
          >
            Download
          </a>
        </div>
      </div>
    </header>
  );
}
