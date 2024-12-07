/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";
import { ElektronAPI, FlatMeter } from "./modules/elektronApi";

declare global {
    interface Window {
        elektronAPI: ElektronAPI;
    }
}
const elektronApi: ElektronAPI = window.elektronAPI;

async function loadStoredData() {
    const meters: Array<FlatMeter> = await elektronApi.getMeters();
    const protoMeterButton: Element = document.getElementById("_proto_meter");
    for (let i = 0; i < meters.length; i++) {
        const newBtn = protoMeterButton.cloneNode(true) as Element;
        protoMeterButton.parentNode.appendChild(newBtn);
        newBtn.setAttribute("id", "btn_meter_" + meters[i].id);
        newBtn.setAttribute("btn-id", "" + meters[i].id);
        newBtn.classList.add("meter-toggle");
        newBtn.classList.remove("hidden");
        newBtn.textContent = meters[i].name;
        newBtn.classList.remove("hidden");
        newBtn.addEventListener("click", handleMeterClick);
    }
}

loadStoredData();

async function handleMeterClick(event: Event) {
    const btn = event.currentTarget as Element;
    const meterId = parseInt(btn.getAttribute("btn-id"));

    const readings = await elektronApi.getMeterEntries(meterId);

    const protoTable: Element = document.getElementById("_proto_meters_table");
    const contentDiv: Element = document.getElementById("content");

    const newTable = protoTable.cloneNode(true) as Element;
    newTable.setAttribute("id", "meters_tbl_" + meterId);

    contentDiv.innerHTML = "";
    const tr = newTable.querySelector(".line");
    for (let i = 0; i < readings.length; i++) {
        const newTr = tr.cloneNode(true) as Element;

        const date = new Date(readings[i].timestamp * 1000);

        newTr.querySelector(".date").innerHTML =
            date.getFullYear() +
            "-" +
            (date.getMonth() + 1) +
            "-" +
            date.getDate() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes();
        newTr.querySelector(".wattage").innerHTML =
            readings[i].wattHours +
            " Wh | " +
            readings[i].medianWattageSincePredecessor +
            " W";

        const removeBtn = newTr.querySelector(".remove-meter-reading");
        removeBtn.setAttribute("meter-id", "" + meterId);
        removeBtn.setAttribute("timestamp", "" + readings[i].timestamp);
        removeBtn.addEventListener("click", removeReading);

        tr.parentElement.appendChild(newTr);
    }

    const newBtn = newTable.querySelector(".new-meter-record");

    newBtn.setAttribute("meter-id", "" + meterId);
    newBtn.addEventListener("click", newReading);

    contentDiv.appendChild(newTable);
}

async function newReading(event: Event) {
    const btn = event.currentTarget as Element;
    const meterId = parseInt(btn.getAttribute("meter-id"));

    const tr = btn.parentNode.parentNode;

    const dateInput = tr.querySelector(".new-date") as HTMLInputElement;
    const timeInput = tr.querySelector(".new-time") as HTMLInputElement;
    const wattageInput = tr.querySelector(".new-wattage") as HTMLInputElement;

    const date = new Date("" + dateInput.value + " " + timeInput.value + ":00");
    const timestamp = Math.floor(date.getTime() / 1000);

    await elektronApi.addMeterEntry(
        meterId,
        timestamp,
        parseInt(wattageInput.value)
    );

    document.getElementById("btn_meter_" + meterId).click();
}

async function removeReading(event: Event) {
    const btn = event.currentTarget as Element;
    const meterId = parseInt(btn.getAttribute("meter-id"));
    const timestamp = parseInt(btn.getAttribute("timestamp"));

    await elektronApi.removeMeterEntry(meterId, timestamp);

    document.getElementById("btn_meter_" + meterId).click();
}
