import { Action } from "./action";
import { RandomTable } from "./random-table";

export class BlocksIndex {
    actions: Action[];
    randomTables: RandomTable[];

    constructor() {
        this.actions = [];
        this.randomTables = [];
    }
}