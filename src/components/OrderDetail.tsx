import { useState } from "react";
import { Order, OrderStatus, getOrderTotal } from "../types";
import { OrderStatusBadge } from "./StatusBadge";
import { EmptyState } from "./States";

interface Props {
  order: Order | null;
  onChangeStatus: (id: string, status: OrderStatus) => Promise<Order>;
  onViewInvoice: (order: Order) => void;
}

const NEXT_ACTIONS: Record<OrderStatus, { label: string; status: OrderStatus; danger?: boolean }[]> = {
  pending: [
    { label: "Accept order", status: "accepted" },
    { label: "Reject order", status: "rejected", danger: true }
  ],
  accepted: [{ label: "Mark preparing", status: "preparing" }],
  preparing: [{ label: "Mark delivered", status: "delivered" }],
  delivered: [],
  rejected: []
};

export function OrderDetail({ order, onChangeStatus, onViewInvoice }: Props) {
  const [updating, setUpdating] = useState<OrderStatus | null>(null);

  if (!order) {
    return (
      <div className="order-detail-card">
        <EmptyState title="No order selected" hint="Pick an order from the list to see its details." />
      </div>
    );
  }

  async function handleTransition(status: OrderStatus) {
    setUpdating(status);
    try {
      await onChangeStatus(order!.id, status);
    } finally {
      setUpdating(null);
    }
  }

  const actions = NEXT_ACTIONS[order.status];

  return (
    <div className="order-detail-card">
      <div className="order-detail-header">
        <div>
          <div style={{ fontSize: 15, fontWeight: 650 }}>{order.customerName}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-mute)" }}>
            {order.id} · {order.customerPhone}
          </div>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <table className="order-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.medicineId}>
              <td>{item.medicineName}</td>
              <td className="mono">{item.quantity}</td>
              <td className="mono">₹{item.unitPrice.toFixed(2)}</td>
              <td className="mono">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-total-row" style={{ display: "flex", justifyContent: "flex-end", fontWeight: 700 }}>
        Total: ₹{getOrderTotal(order).toFixed(2)}
      </div>

      <div className="order-actions">
        {actions.map((action) => (
          <button
            key={action.status}
            className={`btn ${action.danger ? "btn-danger" : "btn-primary"}`}
            onClick={() => handleTransition(action.status)}
            disabled={updating !== null}
          >
            {updating === action.status ? "Updating..." : action.label}
          </button>
        ))}
        <button className="btn" onClick={() => onViewInvoice(order)}>
          View invoice
        </button>
        {actions.length === 0 && (
          <span style={{ fontSize: 12.5, color: "var(--text-mute)", alignSelf: "center" }}>
            This order is in a final state.
          </span>
        )}
      </div>
    </div>
  );
}
