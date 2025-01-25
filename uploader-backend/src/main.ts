import { app, BrowserWindow } from 'electron'
import "./index"

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: true
        },
    });

    mainWindow.setMenu(null)

    mainWindow.loadURL("http://localhost:3250");
    mainWindow.on("closed", function () {
        mainWindow = null;
        app.quit();
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    }
});