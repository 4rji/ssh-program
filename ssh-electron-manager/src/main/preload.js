const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    loadHosts: () => ipcRenderer.invoke('load-hosts'),
    connectToSSH: (host) => ipcRenderer.invoke('connect-ssh', host),
});