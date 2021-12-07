import { Action } from "./action";
import { RandomTable } from "./random-table";

export class BlocksIndex {
    private actions: Action[];
    private randomTables: RandomTable[];

    constructor() {
        this.actions = [];
        this.randomTables = [];
    }

    addAction(action: Action) {
        const existingActionIndex = this.actions.findIndex(x => x.name == action.name);
        if (existingActionIndex !== -1) {
            this.actions[existingActionIndex] = action;
        } else {
            this.actions.push(action);
        }
    }

    addRandomTable(randomTable: RandomTable) {
        const existingRandomTableIndex = this.actions.findIndex(x => x.name == randomTable.name);
        if (existingRandomTableIndex !== -1) {
            this.randomTables[existingRandomTableIndex] = randomTable;
        } else {
            this.randomTables.push(randomTable);
        }
    }
}