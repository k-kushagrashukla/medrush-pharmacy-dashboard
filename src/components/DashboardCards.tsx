import { DashboardStats } from "../types";

export function DashboardCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Orders today", value: stats.ordersToday, warn: false },
    { label: "Pending orders", value: stats.pendingOrders, warn: stats.pendingOrders > 0 },
    { label: "Sales today", value: `₹${stats.salesToday.toFixed(2)}`, warn: false },
    { label: "Low-stock items", value: stats.lowStockCount, warn: stats.lowStockCount > 0 }
  ];

  return (
    <div className="stat-cards">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card ${card.warn ? "warn" : ""}`}>
          <div className="stat-card-label">
            <span>{card.label}</span>
          </div>
          <div className="stat-card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
