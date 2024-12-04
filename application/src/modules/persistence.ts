import * as fs from "fs";
const filename = "elektron.db";

export class MeterEntry {
    timestamp: number;
    wattHours: number;

    constructor(timestamp: number, wattHours: number) {
        this.timestamp = parseInt(timestamp.toString());
        this.wattHours = parseInt(wattHours.toString());
    }
}

export class SaveFile {
    meterEntries: Array<MeterEntry>;

    addEntry(entry: MeterEntry) {
        this.ensurePropertiesNotNull();
        this.meterEntries.push(entry);
    }

    // #TODO time delimiters?
    getEntries() {
        this.ensurePropertiesNotNull();
        return this.meterEntries;
    }

    ensurePropertiesNotNull() {
        if (typeof this.meterEntries == "undefined") {
            this.meterEntries = [];
        }
    }

    contructor() {
        this.meterEntries = [];
    }
}

function ensureFileExists() {
    if (!fs.existsSync(filename)) {
        const defaultDataObject = new SaveFile();
        saveData(defaultDataObject);
    }
}

export function getData(): SaveFile {
    ensureFileExists();
    const string = fs.readFileSync(filename, "utf8");
    const json = JSON.parse(string);
    const obj = new SaveFile();
    Object.assign(obj, json);
    return obj;
}

export function saveData(data: SaveFile) {
    fs.writeFileSync(filename, JSON.stringify(data));
}
