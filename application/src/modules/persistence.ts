import * as fs from "fs";
import { defrostSaveFile } from "./defroster";
const filename = "elektron.db.json";

export class MeterEntry {
    timestamp: number;
    wattHours: number;

    getMedianWattageSinceLastPoint(predecessor: MeterEntry): number {
        const timePassed = this.timestamp - predecessor.timestamp;
        const wattHoursPassed = this.wattHours - predecessor.wattHours;
        return Math.round((wattHoursPassed * 3600) / timePassed);
    }

    constructor(timestamp: number, wattHours: number) {
        this.timestamp = parseInt(timestamp.toString());
        this.wattHours = parseInt(wattHours.toString());
    }
}

export class Meter {
    id: number; // #TODO id and parentId for sub-meter inheritance
    parentId: number;
    name: string;
    meterEntries: Array<MeterEntry>;

    addEntry(entry: MeterEntry) {
        this.meterEntries.push(entry);
    }

    removeEntry(timestamp: number) {
        for (let i = 0; i < this.meterEntries.length; i++) {
            if (this.meterEntries[i].timestamp == timestamp) {
                if (i == 0) {
                    this.meterEntries.shift();
                } else {
                    this.meterEntries.splice(i, 1);
                }
                return true;
            }
        }
        return false;
    }

    // #TODO time delimiters?
    getEntries() {
        return this.meterEntries;
    }

    constructor(name: string) {
        this.name = name;
        this.meterEntries = [];
        this.id = Math.round(Date.now() / 1000);
        this.parentId = 0;
    }
}

export class SaveFile {
    meters: Array<Meter>;

    addMeter(entry: Meter) {
        this.meters.push(entry);
    }

    getMeters() {
        return this.meters;
    }

    // #TODO time delimiters?
    getMeterEntries(meterId: number): Array<MeterEntry> {
        const meter = this.meters.find((meter) => meter.id == meterId);
        if (meter instanceof Meter) {
            return meter.getEntries();
        }
        return [];
    }

    addMeterEntry(
        meterId: number,
        timestamp: number,
        wattHours: number
    ): boolean {
        for (let i = 0; i < this.meters.length; i++) {
            if (this.meters[i].id == meterId) {
                const meterEntry = new MeterEntry(timestamp, wattHours);
                this.meters[i].addEntry(meterEntry);
                saveData(this);
                return true;
            }
        }
        return false;
    }

    removeMeterEntry(meterId: number, timestamp: number): boolean {
        for (let i = 0; i < this.meters.length; i++) {
            if (this.meters[i].id == meterId) {
                const result = this.meters[i].removeEntry(timestamp);
                saveData(this);
                return result;
            }
        }
        return false;
    }

    constructor() {
        this.meters = [];
    }
}

export function getData(): SaveFile {
    ensureFileExists();
    const string = fs.readFileSync(filename, "utf8");
    const json = JSON.parse(string);

    return defrostSaveFile(json);
}

export function saveData(data: SaveFile) {
    fs.writeFileSync(filename, JSON.stringify(data));
}

function ensureFileExists() {
    if (!fs.existsSync(filename)) {
        const defaultDataObject = new SaveFile();
        const defaultMeter = new Meter("Default");
        const defaultEntry = new MeterEntry(1000, 0);
        defaultMeter.addEntry(defaultEntry);
        defaultDataObject.addMeter(defaultMeter);
        saveData(defaultDataObject);
    }
}
