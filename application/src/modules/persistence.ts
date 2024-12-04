import * as fs from "fs";
import { defrostSaveFile } from "./defroster";
const filename = "elektron.db.json";

export class MeterEntry {
    timestamp: number;
    wattHours: number;

    getMedianWattageSince(predecessor: MeterEntry): number {
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

    // #TODO time delimiters?
    getMeters() {
        return this.meters;
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
        const defaultEntry = new MeterEntry(0, 0);
        defaultMeter.addEntry(defaultEntry);
        defaultDataObject.addMeter(defaultMeter);
        saveData(defaultDataObject);
    }
}
