import { useState } from "react";
import { Modal } from "./Modal";
import { parseMedicinesCsv } from "../services/api";
import { Medicine } from "../types";

interface Props {
  onClose: () => void;
  onImport: (rows: Omit<Medicine, "id">[]) => Promise<void>;
}

export function CsvImportModal({ onClose, onImport }: Props) {
  const [rows, setRows] = useState<Omit<Medicine, "id">[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  async function handlePickFile() {
    setError(null);

    // Desktop path: use the native Electron open-file dialog via preload IPC.
    if (window.desktopApi?.isElectron) {
      const result = await window.desktopApi.importInventoryCsv();
      if (!result.ok || !result.content) {
        if (result.error !== "Cancelled by user") setError(result.error ?? "Could not read file");
        return;
      }
      setFileName(result.filePath ?? "selected file");
      setRows(parseMedicinesCsv(result.content));
      return;
    }

    // Browser-preview fallback: plain <input type="file"> so `npm run dev`
    // in a normal browser tab still works for quick UI checks.
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setFileName(file.name);
        setRows(parseMedicinesCsv(String(reader.result)));
      };
      reader.readAsText(file);
    };
    input.click();
  }

  async function handleConfirm() {
    if (!rows) return;
    setImporting(true);
    try {
      await onImport(rows);
      onClose();
    } finally {
      setImporting(false);
    }
  }

  return (
    <Modal
      title="Import inventory from CSV"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={!rows || rows.length === 0 || importing}>
            {importing ? "Importing..." : `Import ${rows?.length ?? 0} rows`}
          </button>
        </>
      }
    >
      <p style={{ marginTop: 0, color: "var(--text-mute)", fontSize: 13 }}>
        Expected columns: <span className="mono">name, quantity, price, batchNumber, expiryDate, lowStockThreshold</span>
      </p>

      <button className="btn" onClick={handlePickFile}>
        Choose CSV file
      </button>

      {fileName && (
        <p style={{ fontSize: 12.5, color: "var(--text-mute)", marginTop: 8 }}>
          Selected: <strong>{fileName}</strong>
        </p>
      )}

      {error && <p className="field-error">{error}</p>}

      {rows && rows.length > 0 && (
        <table className="csv-preview-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Batch</th>
              <th>Expiry</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td>
                <td>{row.quantity}</td>
                <td>{row.price}</td>
                <td>{row.batchNumber}</td>
                <td>{row.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {rows && rows.length > 8 && (
        <p style={{ fontSize: 11.5, color: "var(--text-mute)" }}>+ {rows.length - 8} more rows not shown in preview</p>
      )}
    </Modal>
  );
}
