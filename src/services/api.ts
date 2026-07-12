import { mockMedicines, mockOrders } from "../data/mockData";
import { DashboardStats, Medicine, Order, OrderStatus, getAvailabilityStatus } from "../types";

// In-memory "database". A page refresh resets it - that's expected for
// a mock API layer and is called out in the README as a known limitation.
let medicines: Medicine[] = mockMedicines.map((m) => ({ ...m }));
let orders: Order[] = mockOrders.map((o) => ({ ...o }));

const NETWORK_DELAY_MS = 450;

function delay<T>(value: T, ms = NETWORK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function isSameDay(isoA: string, isoB: string): boolean {
  return isoA.slice(0, 10) === isoB.slice(0, 10);
}

/* ------------------------- Dashboard ------------------------- */

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const todayIso = new Date().toISOString();

  const ordersToday = orders.filter((o) => isSameDay(o.createdAt, todayIso)).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const salesToday = orders
    .filter((o) => isSameDay(o.createdAt, todayIso) && o.status === "delivered")
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0), 0);

  const lowStockCount = medicines.filter((m) => getAvailabilityStatus(m) !== "in_stock").length;

  return delay({ ordersToday, pendingOrders, salesToday, lowStockCount });
}

/* ------------------------- Inventory ------------------------- */

export async function fetchMedicines(): Promise<Medicine[]> {
  return delay(clone(medicines));
}

export async function addMedicine(input: Omit<Medicine, "id">): Promise<Medicine> {
  const newMed: Medicine = { ...input, id: `m${Date.now()}` };
  medicines = [newMed, ...medicines];
  return delay(clone(newMed));
}

export async function updateMedicine(id: string, updates: Partial<Omit<Medicine, "id">>): Promise<Medicine> {
  const idx = medicines.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error(`Medicine ${id} not found`);
  medicines[idx] = { ...medicines[idx], ...updates };
  return delay(clone(medicines[idx]));
}

export async function deleteMedicine(id: string): Promise<{ id: string }> {
  medicines = medicines.filter((m) => m.id !== id);
  return delay({ id });
}

export function medicinesToCsv(list: Medicine[]): string {
  const header = "name,quantity,price,batchNumber,expiryDate,lowStockThreshold";
  const rows = list.map((m) =>
    [m.name, m.quantity, m.price, m.batchNumber, m.expiryDate, m.lowStockThreshold].join(",")
  );
  return [header, ...rows].join("\n");
}

// Very small, dependency-free CSV parser for the import-preview bonus feature.
// Assumes the same column order produced by medicinesToCsv above.
export function parseMedicinesCsv(content: string): Omit<Medicine, "id">[] {
  const lines = content.trim().split(/\r?\n/);
  const [, ...dataLines] = lines; // skip header row
  return dataLines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [name, quantity, price, batchNumber, expiryDate, lowStockThreshold] = line.split(",");
      return {
        name: name?.trim() ?? "Unknown",
        quantity: Number(quantity) || 0,
        price: Number(price) || 0,
        batchNumber: batchNumber?.trim() ?? "-",
        expiryDate: expiryDate?.trim() ?? new Date().toISOString().slice(0, 10),
        lowStockThreshold: Number(lowStockThreshold) || 10
      };
    });
}

/* ------------------------- Orders ------------------------- */

export async function fetchOrders(): Promise<Order[]> {
  return delay(clone(orders));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error(`Order ${id} not found`);
  orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
  return delay(clone(orders[idx]));
}
