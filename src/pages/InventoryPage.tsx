import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { InventoryTable } from "../components/InventoryTable";
import { InventoryFormModal } from "../components/InventoryFormModal";
import { CsvImportModal } from "../components/CsvImportModal";
import { LoadingState, ErrorBanner } from "../components/States";
import { medicinesToCsv } from "../services/api";
import { Medicine } from "../types";

export function InventoryPage() {
  const { medicines, loading, error, reload, create, update, remove } = useInventory();
  const [formTarget, setFormTarget] = useState<Medicine | "new" | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  async function handleSave(input: Omit<Medicine, "id">) {
    if (formTarget && formTarget !== "new") {
      await update(formTarget.id, input);
    } else {
      await create(input);
    }
  }

  async function handleImportRows(rows: Omit<Medicine, "id">[]) {
    for (const row of rows) {
      await create(row);
    }
  }

  async function handleExport() {
    setExportStatus(null);
    const csv = medicinesToCsv(medicines);

    if (window.desktopApi?.isElectron) {
      const result = await window.desktopApi.exportInventoryCsv(csv);
      setExportStatus(
        result.ok ? `Exported to ${result.filePath}` : result.error === "Cancelled by user" ? null : `Export failed: ${result.error}`
      );
      return;
    }

    // Browser-preview fallback: trigger a normal file download.
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "medrush-inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Inventory</h1>
          <p>{medicines.length} medicines tracked · rows highlighted amber/red need restocking.</p>
        </div>
      </div>

      <div className="toolbar">
        <button className="btn btn-primary" onClick={() => setFormTarget("new")}>
          + Add medicine
        </button>
        <button className="btn" onClick={() => setShowImport(true)}>
          Import CSV
        </button>
        <button className="btn" onClick={handleExport} disabled={medicines.length === 0}>
          Export CSV
        </button>
      </div>

      {exportStatus && <p style={{ fontSize: 12.5, color: "var(--text-mute)", marginTop: -8, marginBottom: 12 }}>{exportStatus}</p>}

      {error && <ErrorBanner message={error} onRetry={reload} />}
      {loading ? (
        <LoadingState label="Loading inventory..." />
      ) : (
        <InventoryTable medicines={medicines} onEdit={(m) => setFormTarget(m)} onDelete={remove} />
      )}

      {formTarget && (
        <InventoryFormModal
          initial={formTarget === "new" ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSave={handleSave}
        />
      )}

      {showImport && <CsvImportModal onClose={() => setShowImport(false)} onImport={handleImportRows} />}
    </div>
  );
}
