import { useState } from "react";
import { Order, getOrderTotal } from "../types";
import { EmptyState } from "./States";

export function InvoicePreview({ order }: { order: Order | null }) {
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  if (!order) {
    return <EmptyState title="No invoice selected" hint="Open an order and choose 'View invoice'." />;
  }

  async function handlePrint() {
    setPrintStatus(null);
    if (window.desktopApi?.isElectron) {
      // Real desktop feature: opens the OS's native print dialog for this window.
      const result = await window.desktopApi.printInvoice();
      setPrintStatus(result.ok ? "Sent to printer." : `Print cancelled or failed: ${result.error ?? "unknown"}`);
    } else {
      // Browser-preview fallback.
      window.print();
    }
  }

  function handleDownload() {
    // Placeholder per task spec ("print/download placeholder") - a full PDF
    // export would use a library like pdf-lib in a real build.
    setPrintStatus("Download as PDF is not wired up in this trial build - see README limitations.");
  }

  const total = getOrderTotal(order!);

  return (
    <div>
      <div className="toolbar">
        <button className="btn btn-primary" onClick={handlePrint}>
          Print invoice
        </button>
        <button className="btn" onClick={handleDownload}>
          Download PDF
        </button>
      </div>

      {printStatus && <p style={{ fontSize: 12.5, color: "var(--text-mute)" }}>{printStatus}</p>}

      <div className="invoice-paper">
        <div className="invoice-header">
          <div>
            <h2>MedRush Pharmacy</h2>
            <p>Invoice · {order!.id}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>{new Date(order!.createdAt).toLocaleString()}</p>
            <p>Billed to: {order!.customerName}</p>
          </div>
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
            {order!.items.map((item) => (
              <tr key={item.medicineId}>
                <td>{item.medicineName}</td>
                <td className="mono">{item.quantity}</td>
                <td className="mono">₹{item.unitPrice.toFixed(2)}</td>
                <td className="mono">₹{(item.quantity * item.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total-row">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
