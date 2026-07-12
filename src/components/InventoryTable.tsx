import { Medicine, getAvailabilityStatus } from "../types";
import { StockBadge } from "./StatusBadge";
import { EmptyState } from "./States";

interface Props {
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onDelete: (id: string) => void;
}

function formatExpiry(iso: string) {
  const date = new Date(iso);
  const daysLeft = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return { text: date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }), daysLeft };
}

export function InventoryTable({ medicines, onEdit, onDelete }: Props) {
  if (medicines.length === 0) {
    return <EmptyState title="No medicines in inventory" hint="Add your first item to get started." />;
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Batch No.</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Expiry</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => {
            const status = getAvailabilityStatus(med);
            const expiry = formatExpiry(med.expiryDate);
            const rowClass = status === "out_of_stock" ? "row-out-of-stock" : status === "low_stock" ? "row-low-stock" : "";
            return (
              <tr key={med.id} className={rowClass}>
                <td>{med.name}</td>
                <td className="mono">{med.batchNumber}</td>
                <td className="mono">{med.quantity}</td>
                <td className="mono">₹{med.price.toFixed(2)}</td>
                <td className="mono" title={expiry.daysLeft < 0 ? "Expired" : `${expiry.daysLeft} days left`}>
                  {expiry.text}
                </td>
                <td>
                  <StockBadge status={status} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-sm" onClick={() => onEdit(med)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => onDelete(med.id)}>
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
