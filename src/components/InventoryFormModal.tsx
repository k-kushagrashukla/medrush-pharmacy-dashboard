import { useState } from "react";
import { Modal } from "./Modal";
import { Medicine } from "../types";

interface Props {
  initial?: Medicine | null;
  onClose: () => void;
  onSave: (input: Omit<Medicine, "id">) => Promise<void>;
}

type FormState = {
  name: string;
  quantity: string;
  price: string;
  batchNumber: string;
  expiryDate: string;
  lowStockThreshold: string;
};

function toFormState(m?: Medicine | null): FormState {
  return {
    name: m?.name ?? "",
    quantity: m ? String(m.quantity) : "",
    price: m ? String(m.price) : "",
    batchNumber: m?.batchNumber ?? "",
    expiryDate: m?.expiryDate ?? "",
    lowStockThreshold: m ? String(m.lowStockThreshold) : "20"
  };
}

export function InventoryFormModal({ initial, onClose, onSave }: Props) {
  const [form, setForm] = useState<FormState>(toFormState(initial));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Medicine name is required";
    if (!form.batchNumber.trim()) next.batchNumber = "Batch number is required";
    if (!form.expiryDate) next.expiryDate = "Expiry date is required";
    if (form.quantity === "" || Number(form.quantity) < 0 || !Number.isFinite(Number(form.quantity)))
      next.quantity = "Enter a valid quantity (0 or more)";
    if (form.price === "" || Number(form.price) < 0 || !Number.isFinite(Number(form.price)))
      next.price = "Enter a valid price";
    if (form.lowStockThreshold === "" || Number(form.lowStockThreshold) < 0)
      next.lowStockThreshold = "Enter a valid threshold";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        name: form.name.trim(),
        quantity: Number(form.quantity),
        price: Number(form.price),
        batchNumber: form.batchNumber.trim(),
        expiryDate: form.expiryDate,
        lowStockThreshold: Number(form.lowStockThreshold)
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={initial ? "Edit medicine" : "Add medicine"}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : initial ? "Save changes" : "Add medicine"}
          </button>
        </>
      }
    >
      <div className="form-row">
        <label htmlFor="name">Medicine name</label>
        <input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Paracetamol 500mg" />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row-2">
        <div className="form-row">
          <label htmlFor="quantity">Quantity</label>
          <input id="quantity" type="number" min={0} value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>
        <div className="form-row">
          <label htmlFor="price">Price (₹ / unit)</label>
          <input id="price" type="number" min={0} step="0.1" value={form.price} onChange={(e) => update("price", e.target.value)} />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>
      </div>

      <div className="form-row-2">
        <div className="form-row">
          <label htmlFor="batch">Batch number</label>
          <input id="batch" value={form.batchNumber} onChange={(e) => update("batchNumber", e.target.value)} placeholder="e.g. PCM-2301" />
          {errors.batchNumber && <span className="field-error">{errors.batchNumber}</span>}
        </div>
        <div className="form-row">
          <label htmlFor="expiry">Expiry date</label>
          <input id="expiry" type="date" value={form.expiryDate} onChange={(e) => update("expiryDate", e.target.value)} />
          {errors.expiryDate && <span className="field-error">{errors.expiryDate}</span>}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="threshold">Low-stock threshold</label>
        <input
          id="threshold"
          type="number"
          min={0}
          value={form.lowStockThreshold}
          onChange={(e) => update("lowStockThreshold", e.target.value)}
        />
        {errors.lowStockThreshold && <span className="field-error">{errors.lowStockThreshold}</span>}
      </div>
    </Modal>
  );
}
