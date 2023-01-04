const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    search: (search) => ipcRenderer.invoke('search', search)
});