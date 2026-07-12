import { Medicine, Order } from "../types";

// This file is the closest thing we have to a database for this trial task.
// In a real MedRush build, api.ts would call a real backend instead of
// reading these arrays - the rest of the app wouldn't need to change.

export const mockMedicines: Medicine[] = [
  { id: "m1", name: "Paracetamol 500mg", quantity: 320, price: 2.5, batchNumber: "PCM-2301", expiryDate: "2027-03-01", lowStockThreshold: 50 },
  { id: "m2", name: "Amoxicillin 250mg", quantity: 18, price: 8.0, batchNumber: "AMX-1187", expiryDate: "2026-11-15", lowStockThreshold: 30 },
  { id: "m3", name: "Cetirizine 10mg", quantity: 140, price: 1.8, batchNumber: "CTZ-0042", expiryDate: "2027-06-20", lowStockThreshold: 40 },
  { id: "m4", name: "Metformin 500mg", quantity: 9, price: 3.2, batchNumber: "MET-9981", expiryDate: "2026-09-10", lowStockThreshold: 25 },
  { id: "m5", name: "Azithromycin 500mg", quantity: 0, price: 14.0, batchNumber: "AZM-3345", expiryDate: "2026-08-01", lowStockThreshold: 20 },
  { id: "m6", name: "Ibuprofen 400mg", quantity: 210, price: 2.0, batchNumber: "IBU-5521", expiryDate: "2027-01-12", lowStockThreshold: 40 },
  { id: "m7", name: "Omeprazole 20mg", quantity: 26, price: 5.5, batchNumber: "OMP-7712", expiryDate: "2026-07-25", lowStockThreshold: 30 },
  { id: "m8", name: "Cough Syrup 100ml", quantity: 60, price: 45.0, batchNumber: "CFS-4432", expiryDate: "2026-12-31", lowStockThreshold: 15 }
];

const now = new Date();
const today = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

export const mockOrders: Order[] = [
  {
    id: "ord-1001",
    customerName: "Ritika Sharma",
    customerPhone: "98765xxxxx",
    items: [
      { medicineId: "m1", medicineName: "Paracetamol 500mg", quantity: 2, unitPrice: 2.5 },
      { medicineId: "m3", medicineName: "Cetirizine 10mg", quantity: 1, unitPrice: 1.8 }
    ],
    status: "pending",
    createdAt: today(1),
    updatedAt: today(1)
  },
  {
    id: "ord-1002",
    customerName: "Aman Verma",
    customerPhone: "91234xxxxx",
    items: [{ medicineId: "m2", medicineName: "Amoxicillin 250mg", quantity: 1, unitPrice: 8.0 }],
    status: "accepted",
    createdAt: today(3),
    updatedAt: today(2)
  },
  {
    id: "ord-1003",
    customerName: "Fatima Khan",
    customerPhone: "99887xxxxx",
    items: [
      { medicineId: "m6", medicineName: "Ibuprofen 400mg", quantity: 3, unitPrice: 2.0 },
      { medicineId: "m8", medicineName: "Cough Syrup 100ml", quantity: 1, unitPrice: 45.0 }
    ],
    status: "preparing",
    createdAt: today(5),
    updatedAt: today(1)
  },
  {
    id: "ord-1004",
    customerName: "Rohan Gupta",
    customerPhone: "90011xxxxx",
    items: [{ medicineId: "m4", medicineName: "Metformin 500mg", quantity: 2, unitPrice: 3.2 }],
    status: "delivered",
    createdAt: today(20),
    updatedAt: today(18)
  },
  {
    id: "ord-1005",
    customerName: "Simran Kaur",
    customerPhone: "97766xxxxx",
    items: [{ medicineId: "m5", medicineName: "Azithromycin 500mg", quantity: 1, unitPrice: 14.0 }],
    status: "rejected",
    createdAt: today(30),
    updatedAt: today(29)
  },
  {
    id: "ord-1006",
    customerName: "Devansh Rao",
    customerPhone: "90099xxxxx",
    items: [{ medicineId: "m7", medicineName: "Omeprazole 20mg", quantity: 2, unitPrice: 5.5 }],
    status: "pending",
    createdAt: today(0.5),
    updatedAt: today(0.5)
  }
];
