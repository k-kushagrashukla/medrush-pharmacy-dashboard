const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  inventory: "Inventory",
  orders: "Orders",
  invoice: "Invoice Preview"
};

export function TopBar({ page }: { page: string }) {
  const isElectron = typeof window !== "undefined" && !!window.desktopApi?.isElectron;

  return (
    <header className="topbar">
      <div className="topbar-title">{TITLES[page] ?? page}</div>
      <div className="topbar-meta">
        <span className={`env-pill ${isElectron ? "" : "web"}`}>
          {isElectron ? "Electron desktop" : "Browser preview"}
        </span>
        <span>{new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</span>
      </div>
    </header>
  );
}
