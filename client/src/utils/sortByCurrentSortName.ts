import { ESorts } from "../types/ESorts";
import { TFile } from "../types/TFile";

export const sortByCurrentSortName = (a: TFile, b: TFile, curSort: ESorts) => {
    if (curSort === ESorts.NAME) {
        return a.name.localeCompare(b.name)
    } else if (curSort === ESorts.SIZE) {
        return a.size > b.size ? -1 : 1;
    } else {
        return new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 1
    }
}