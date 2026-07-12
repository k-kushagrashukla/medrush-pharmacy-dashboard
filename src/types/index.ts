// ---------- Inventory ----------

export type AvailabilityStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Medicine {
  id: string;
  name: string;
  quantity: number;
  price: number; // per unit, in INR
  batchNumber: string;
  expiryDate: string; // ISO date string, e.g. "2026-12-01"
  lowStockThreshold: number;
}

// Availability is derived from quantity vs threshold, not stored -
// it should never be able to drift out of sync with quantity.
export function getAvailabilityStatus(med: Pick<Medicine, "quantity" | "lowStockThreshold">): AvailabilityStatus {
  if (med.quantity <= 0) return "out_of_stock";
  if (med.quantity <= med.lowStockThreshold) return "low_stock";
  return "in_stock";
}

// ---------- Orders ----------

export type OrderStatus = "pending" | "accepted" | "preparing" | "delivered" | "rejected";

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export function getOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

// ---------- Dashboard ----------

export interface DashboardStats {
  ordersToday: number;
  pendingOrders: number;
  salesToday: number; // INR
  lowStockCount: number;
}

// ---------- Generic async state used by hooks ----------

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
