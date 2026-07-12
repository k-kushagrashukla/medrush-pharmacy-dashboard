import { useState } from "react";
import { Sidebar, Page } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardPage } from "./pages/DashboardPage";
import { InventoryPage } from "./pages/InventoryPage";
import { OrdersPage } from "./pages/OrdersPage";
import { InvoicePreview } from "./components/InvoicePreview";
import { Order } from "./types";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  function goToInvoice(order: Order) {
    setInvoiceOrder(order);
    setPage("invoice");
  }

  return (
    <div className="app-shell">
      <Sidebar current={page} onNavigate={setPage} />
      <TopBar page={page} />
      <main className="main">
        {page === "dashboard" && <DashboardPage />}
        {page === "inventory" && <InventoryPage />}
        {page === "orders" && <OrdersPage onViewInvoice={goToInvoice} />}
        {page === "invoice" && (
          <div>
            <div className="page-header">
              <div>
                <h1>Invoice Preview</h1>
                <p>Preview, print, or export a receipt for a customer order.</p>
              </div>
            </div>
            <InvoicePreview order={invoiceOrder} />
          </div>
        )}
      </main>
    </div>
  );
}
