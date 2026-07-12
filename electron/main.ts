import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";

const isDev = process.env.NODE_ENV === "development";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 1024,
    minHeight: 700,
    title: "MedRush Pharmacy Dashboard",
    backgroundColor: "#0f1720",
    webPreferences: {
      // contextIsolation + a preload script is the "safe IPC" pattern:
      // the renderer (React app) never gets direct Node/fs access.
      // It can only call the specific functions we expose in preload.ts.
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* ---------------- IPC: desktop-specific features ---------------- */

// 1. Export inventory to a CSV file on disk, using the native Save dialog.
ipcMain.handle("inventory:export-csv", async (_event, csvContent: string) => {
  if (!mainWindow) return { ok: false, error: "No window" };

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: "Export inventory",
    defaultPath: `medrush-inventory-${Date.now()}.csv`,
    filters: [{ name: "CSV Files", extensions: ["csv"] }]
  });

  if (canceled || !filePath) return { ok: false, error: "Cancelled by user" };

  try {
    fs.writeFileSync(filePath, csvContent, "utf-8");
    return { ok: true, filePath };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
});

// 2. Import a CSV file for the "CSV import preview" bonus feature.
ipcMain.handle("inventory:import-csv", async () => {
  if (!mainWindow) return { ok: false, error: "No window" };

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: "Import inventory CSV",
    properties: ["openFile"],
    filters: [{ name: "CSV Files", extensions: ["csv"] }]
  });

  if (canceled || filePaths.length === 0) return { ok: false, error: "Cancelled by user" };

  try {
    const content = fs.readFileSync(filePaths[0], "utf-8");
    return { ok: true, filePath: filePaths[0], content };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
});

// 3. Native print for the invoice preview screen (real desktop print dialog,
// not just window.print() inside a browser tab).
ipcMain.handle("invoice:print", async () => {
  if (!mainWindow) return { ok: false, error: "No window" };
  return new Promise((resolve) => {
    mainWindow!.webContents.print({ silent: false, printBackground: true }, (success, errorType) => {
      resolve(success ? { ok: true } : { ok: false, error: errorType });
    });
  });
});
