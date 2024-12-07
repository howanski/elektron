// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("elektronAPI", {
    getMeters: () => ipcRenderer.invoke("getMeters"),
    getMeterEntries: (meterId: number) =>
        ipcRenderer.invoke("getMeterEntries", meterId),
    addMeterEntry: (meterId: number, timestamp: number, wattHours: number) =>
        ipcRenderer.invoke("addMeterEntry", meterId, timestamp, wattHours),
    removeMeterEntry: (meterId: number, timestamp: number) =>
        ipcRenderer.invoke("removeMeterEntry", meterId, timestamp),
});
