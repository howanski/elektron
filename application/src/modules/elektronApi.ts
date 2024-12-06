import { Meter } from "./persistence";

interface GetterOfMeters {
    (): Promise<Array<FlatMeter>>;
}

export interface ElektronAPI {
    getMeters: GetterOfMeters;
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

export function flattenMeter(meter: Meter): FlatMeter {
    const flatMeter = new FlatMeter(
        meter.id,
        meter.name,
        meter.meterEntries.length > 0
    );

    return flatMeter;
}

export function flattenMeters(meters: Array<Meter>): Array<FlatMeter> {
    const result = [];
    for (let i = 0; i < meters.length; i++) {
        result[i] = flattenMeter(meters[i]);
    }

    return result;
}
