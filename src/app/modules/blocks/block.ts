import { Action } from "./action";
import { RandomTable } from "./random-table";

export class Block {
    public get friendlyName() : string {
        return `${this.chronicleName}: ${this.content.name}`;
    }
    
    constructor(
        public readonly chronicleName: string,
        public readonly content: Action | RandomTable
    ) { }
}