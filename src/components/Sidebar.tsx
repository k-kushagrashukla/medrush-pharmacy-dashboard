export type Page = "dashboard" | "inventory" | "orders" | "invoice";

const NAV_ITEMS: { key: Page; label: string; icon: string }[] = [
  { key: "dashboard", label: "Dashboard", icon: "◆" },
  { key: "inventory", label: "Inventory", icon: "▤" },
  { key: "orders", label: "Orders", icon: "▸" },
  { key: "invoice", label: "Invoice Preview", icon: "▦" }
];

export function Sidebar({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">MR</div>
        <div>
          <div className="sidebar-brand-name">MedRush</div>
          <div className="sidebar-brand-sub">Pharmacy Desktop</div>
        </div>
      </div>

      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${current === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">MedRush Trial Build · v1.0.0</div>
    </aside>
  );
}
