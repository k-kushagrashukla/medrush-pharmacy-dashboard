import { useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { OrderList } from "../components/OrderList";
import { OrderDetail } from "../components/OrderDetail";
import { LoadingState, ErrorBanner } from "../components/States";
import { Order, OrderStatus } from "../types";

export function OrdersPage({ onViewInvoice }: { onViewInvoice: (order: Order) => void }) {
  const { orders, loading, error, reload, setStatus } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Move orders through pending → accepted → preparing → delivered.</p>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading ? (
        <LoadingState label="Loading orders..." />
      ) : (
        <div className="orders-layout">
          <OrderList
            orders={orders}
            filter={filter}
            onFilterChange={setFilter}
            selectedId={selectedId}
            onSelect={(o) => setSelectedId(o.id)}
          />
          <OrderDetail order={selected} onChangeStatus={setStatus} onViewInvoice={onViewInvoice} />
        </div>
      )}
    </div>
  );
}
