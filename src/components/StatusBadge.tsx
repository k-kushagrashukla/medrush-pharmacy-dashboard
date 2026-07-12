import { AvailabilityStatus, OrderStatus } from "../types";

const ORDER_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  preparing: "Preparing",
  delivered: "Delivered",
  rejected: "Rejected"
};

const STOCK_LABELS: Record<AvailabilityStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock"
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`badge badge-${status}`}>{ORDER_LABELS[status]}</span>;
}

export function StockBadge({ status }: { status: AvailabilityStatus }) {
  return <span className={`badge badge-${status}`}>{STOCK_LABELS[status]}</span>;
}
