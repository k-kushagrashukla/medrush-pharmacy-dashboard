import { Order, OrderStatus, getOrderTotal } from "../types";
import { OrderStatusBadge } from "./StatusBadge";
import { EmptyState } from "./States";

const FILTERS: { key: OrderStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "delivered", label: "Delivered" },
  { key: "rejected", label: "Rejected" }
];

interface Props {
  orders: Order[];
  filter: OrderStatus | "all";
  onFilterChange: (f: OrderStatus | "all") => void;
  selectedId: string | null;
  onSelect: (order: Order) => void;
}

export function OrderList({ orders, filter, onFilterChange, selectedId, onSelect }: Props) {
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-tab ${filter === f.key ? "active" : ""}`}
            onClick={() => onFilterChange(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="data-table-wrap">
        {filtered.length === 0 ? (
          <EmptyState title="No orders in this view" hint="Try a different filter." />
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className={`order-row ${selectedId === order.id ? "selected" : ""}`}
              onClick={() => onSelect(order)}
            >
              <div className="order-row-top">
                <span>{order.customerName}</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="order-row-meta">
                <span className="mono">{order.id}</span>
                <span>₹{getOrderTotal(order).toFixed(2)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
