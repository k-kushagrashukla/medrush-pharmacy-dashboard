import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";
import { Order, OrderStatus } from "../types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchOrders();
      setOrders(data);
    } catch (err) {
      setError((err as Error).message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = useCallback(async (id: string, status: OrderStatus) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  }, []);

  return { orders, loading, error, reload: load, setStatus };
}
