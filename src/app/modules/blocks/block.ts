import { Action } from "./action";
import { RandomTable } from "./random-table";

export class Block {
    public get friendlyName() : string {
        return `${this.noteName}: ${this.content.name}`;
    }
    
    constructor(
        public readonly noteName: string,
        public readonly content: Action | RandomTable
    ) { }
}