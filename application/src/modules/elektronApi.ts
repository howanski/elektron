import { Meter } from "./persistence";

interface GetterOfMeters {
    (): Promise<Array<Meter>>;
}

export interface ElektronAPI {
    getMeters: GetterOfMeters;
}
