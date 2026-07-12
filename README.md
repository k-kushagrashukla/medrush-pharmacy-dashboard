# MedRush Pharmacy Desktop Dashboard

A desktop pharmacy operations dashboard built with **Electron + React + TypeScript + Vite**, built as a trial task submission.

Runs as an installed desktop app (not a website): a real OS window, native file
save/open dialogs, and native print — all wired through a safe Electron IPC bridge.

## Features implemented

- Electron shell hosting a React + TypeScript UI (`npm run dev` opens a real desktop window)
- Dashboard cards: orders today, pending orders, sales today, low-stock count
- Inventory table: name, quantity, price, batch number, expiry date, availability status
- Add medicine (modal form) and Edit medicine (modal form), both with validation
- Low-stock / out-of-stock rows highlighted with a colored left-edge indicator
- Orders list with filter tabs (pending / accepted / preparing / delivered / rejected)
- Order detail view with Accept / Reject / Mark Preparing / Mark Delivered transitions
- Invoice preview screen with **Print** (native OS print dialog via IPC) and a Download placeholder
- Loading, empty, and error states on every data view
- **CSV import preview** (bonus): pick a `.csv` file via the native file picker, preview parsed rows, then commit
- **CSV export**: writes an inventory `.csv` to disk via the native save dialog
- **Safe IPC separation** (bonus): `contextIsolation: true`, `nodeIntegration: false` - the renderer only ever
  talks to `window.desktopApi`, a small explicit set of functions exposed by `electron/preload.ts`. It has no
  direct access to Node, `fs`, or `ipcRenderer`.
- Reusable components: `Table` styling, `OrderStatusBadge` / `StockBadge`, `Modal`, loading/empty/error states

## Tech stack

- Electron 31
- React 18 + TypeScript
- Vite 5 (renderer bundler)
- No UI framework/library - plain CSS with a small design-token file (`src/index.css`), to keep the bundle
  small and dependency count low for a 4-8 hour trial scope
- Mock API layer (`src/services/api.ts`) with simulated network delay - no real backend involved

## Project structure

```
electron/
  main.ts       - creates the BrowserWindow, registers IPC handlers (save/open dialogs, print)
  preload.ts     - contextBridge: the ONLY thing the renderer can call on the OS/file system
src/
  types/         - Medicine, Order, DashboardStats models + derived-state helpers
  data/          - mockMedicines / mockOrders "seed data"
  services/api.ts- mock API layer (fetch/add/update/delete, simulated delay)
  hooks/         - useInventory, useOrders (data fetching + mutations, kept out of components)
  components/    - Sidebar, TopBar, DashboardCards, InventoryTable, InventoryFormModal,
                   CsvImportModal, OrderList, OrderDetail, InvoicePreview, StatusBadge, Modal, States
  pages/         - DashboardPage, InventoryPage, OrdersPage (wire hooks + components together)
  App.tsx        - top-level navigation/routing between pages
```

## Setup

Requires Node.js 18+.

```bash
npm install
npm run dev
```

`npm run dev` runs the Vite dev server and Electron together (via `concurrently`) and opens a real
desktop window pointed at `http://localhost:5173`.

### Production build

```bash
npm run build      # builds the renderer (dist/) and compiles electron/*.ts (dist-electron/)
npm run dist        # additionally packages a Windows installer via electron-builder, output in release/
```

`npm run dist` requires `electron-builder`'s platform tooling; on a plain Windows machine this produces an
NSIS installer under `release/`. This was not run end-to-end for the submission (no Windows machine in the
build environment) but `npm run build` was verified to compile cleanly on both the renderer and main/preload
sides.

## Assumptions

- Currency is shown in ₹ (INR), consistent with the India-context pharmacy use case.
- "Sales today" on the dashboard sums only orders with status `delivered` created today (an order isn't
  counted as a sale until it's actually fulfilled).
- Availability status (`in_stock` / `low_stock` / `out_of_stock`) is always **derived** from
  `quantity` vs `lowStockThreshold`, never stored directly - so it can't drift out of sync when quantity changes.
- CSV import/export uses a fixed column order: `name, quantity, price, batchNumber, expiryDate, lowStockThreshold`.

## Known limitations

- Data is in-memory only (`src/services/api.ts`). Restarting the app resets everything to the seed data in
  `src/data/mockData.ts`. A real build would replace this file's internals with real HTTP/DB calls without
  touching any component.
- "Download PDF" on the invoice screen is an explicit placeholder (per the task spec, either print or download
  was required as the desktop feature - print was fully implemented as the primary one).
- No authentication/login screen - out of scope for this trial.
- No automated tests were added given the 4-8 hour scope; validation was done via `tsc --noEmit` and manual
  click-through of every flow.
- Packaged Windows installer (`npm run dist`) was configured but not run/tested in this environment.

## Time spent

~[fill in your actual hours] hours.
