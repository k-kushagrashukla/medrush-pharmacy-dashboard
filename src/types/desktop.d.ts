export {};

declare global {
  interface Window {
    desktopApi?: {
      isElectron: boolean;
      exportInventoryCsv: (csv: string) => Promise<{ ok: boolean; filePath?: string; error?: string }>;
      importInventoryCsv: () => Promise<{ ok: boolean; filePath?: string; content?: string; error?: string }>;
      printInvoice: () => Promise<{ ok: boolean; error?: string }>;
    };
  }
}
