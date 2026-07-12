import { contextBridge, ipcRenderer } from "electron";

// This is the ONLY bridge between the React app (renderer) and the OS.
// The renderer never gets `require`, `fs`, or raw ipcRenderer - only
// these specific, named functions. This is the "safe IPC separation" pattern.
contextBridge.exposeInMainWorld("desktopApi", {
  exportInventoryCsv: (csvContent: string) =>
    ipcRenderer.invoke("inventory:export-csv", csvContent),

  importInventoryCsv: () => ipcRenderer.invoke("inventory:import-csv"),

  printInvoice: () => ipcRenderer.invoke("invoice:print"),

  isElectron: true
});
