import { MeterEntry } from "./persistence";

interface GetterOfMeterEntries {
    (): Promise<Array<MeterEntry>>;
}

export interface ElektronAPI {
    getEntries: GetterOfMeterEntries;
}
