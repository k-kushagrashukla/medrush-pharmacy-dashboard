import { useCallback, useEffect, useState } from "react";
import * as api from "../services/api";
import { Medicine } from "../types";

export function useInventory() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchMedicines();
      setMedicines(data);
    } catch (err) {
      setError((err as Error).message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (input: Omit<Medicine, "id">) => {
    const created = await api.addMedicine(input);
    setMedicines((prev) => [created, ...prev]);
  }, []);

  const update = useCallback(async (id: string, updates: Partial<Omit<Medicine, "id">>) => {
    const updated = await api.updateMedicine(id, updates);
    setMedicines((prev) => prev.map((m) => (m.id === id ? updated : m)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await api.deleteMedicine(id);
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { medicines, loading, error, reload: load, create, update, remove };
}
