const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    off: (channel, func) => ipcRenderer.off(channel, func),
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    getAppPath: () => ipcRenderer.invoke('app:get-app-path'),
  },
  dialog: {
    openDirectory: () => ipcRenderer.invoke('dialog:open-directory'),
  },
  file: {
    read: (path) => ipcRenderer.invoke('file:read', path),
    write: (path, content) => ipcRenderer.invoke('file:write', path, content),
  },
  database: {
    backup: (path) => ipcRenderer.invoke('database:backup', path),
  },
});
