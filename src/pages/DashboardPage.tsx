import { useEffect, useState } from "react";
import { DashboardCards } from "../components/DashboardCards";
import { LoadingState, ErrorBanner } from "../components/States";
import { fetchDashboardStats } from "../services/api";
import { DashboardStats } from "../types";

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Today's snapshot across orders, sales, and stock levels.</p>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={load} />}
      {loading && !stats && <LoadingState label="Loading dashboard..." />}
      {stats && <DashboardCards stats={stats} />}
    </div>
  );
}
