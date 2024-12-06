import { Meter, MeterEntry, SaveFile } from "./persistence";

export function defrostMeter(object: object): Meter {
    const meter = new Meter("");
    Object.assign(meter, object);
    for (let i = 0; i < meter.meterEntries.length; i++) {
        const entryBlob = meter.meterEntries[i];
        const entry = new MeterEntry(0, 0);
        Object.assign(entry, entryBlob);
        meter.meterEntries[i] = entry;
    }

    meter.meterEntries.sort(meterEntryTimestampCompare);

    return meter;
}

export function defrostSaveFile(object: object): SaveFile {
    const saveFile = new SaveFile();
    Object.assign(saveFile, object);
    for (let i = 0; i < saveFile.meters.length; i++) {
        const meterBlob = saveFile.meters[i];
        const meter = defrostMeter(meterBlob);

        saveFile.meters[i] = meter;
    }

    return saveFile;
}

function meterEntryTimestampCompare(a: MeterEntry, b: MeterEntry) {
    if (a.timestamp < b.timestamp) {
        return -1;
    }
    if (a.timestamp > b.timestamp) {
        return 1;
    }
    return 0;
}
