import { Meter, MeterEntry } from "./persistence";

interface GetterOfMeters {
    (): Promise<Array<FlatMeter>>;
}

interface GetterOfMeterEntries {
    (meterId: number): Promise<Array<FlatMeterEntry>>;
}

interface AdderOfMeterEntry {
    (meterId: number, timestamp: number, wattHours: number): Promise<boolean>;
}

interface RemoverOfMeterEntry {
    (meterId: number, timestamp: number): Promise<boolean>;
}

export interface ElektronAPI {
    getMeters: GetterOfMeters;
    getMeterEntries: GetterOfMeterEntries;
    addMeterEntry: AdderOfMeterEntry;
    removeMeterEntry: RemoverOfMeterEntry;
}

export class FlatMeter {
    id: number;
    name: string;
    hasReadings: boolean;

    constructor(id: number, name: string, hasReadings: boolean) {
        this.id = id;
        this.name = name;
        this.hasReadings = hasReadings;
    }
}

export class FlatMeterEntry {
    timestamp: number;
    wattHours: number;
    medianWattageSincePredecessor: number;
    constructor(
        timestamp: number,
        wattHours: number,
        medianWattageSincePredecessor: number
    ) {
        this.timestamp = timestamp;
        this.wattHours = wattHours;
        this.medianWattageSincePredecessor = medianWattageSincePredecessor;
    }
}

function flattenMeter(meter: Meter): FlatMeter {
    return new FlatMeter(meter.id, meter.name, meter.meterEntries.length > 0);
}

export function flattenMeters(meters: Array<Meter>): Array<FlatMeter> {
    const result = [];
    for (let i = 0; i < meters.length; i++) {
        result[i] = flattenMeter(meters[i]);
    }

    return result;
}

export function flattenMeterEntry(
    entry: MeterEntry,
    predecessor?: MeterEntry
): FlatMeterEntry {
    let wattage = 0;
    if (predecessor instanceof MeterEntry) {
        wattage = entry.getMedianWattageSinceLastPoint(predecessor);
    }
    return new FlatMeterEntry(entry.timestamp, entry.wattHours, wattage);
}

export function flattenMeterEntries(
    entries: Array<MeterEntry>
): Array<FlatMeterEntry> {
    const result = [];
    let predecessor = null;
    for (let i = 0; i < entries.length; i++) {
        result[i] = flattenMeterEntry(entries[i], predecessor);
        predecessor = entries[i];
    }

    return result;
}
