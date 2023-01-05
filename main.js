const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { scrape } = require('./script');

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.webContents.setWindowOpenHandler(function ({ url }) {
        shell.openExternal(url);
        return { action: 'deny'};
    });
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    ipcMain.handle('search', async (event, search) => {
        let result = await scrape(search);
        return result;
    });
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});