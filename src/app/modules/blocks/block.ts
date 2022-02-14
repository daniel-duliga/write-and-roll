import { Action } from "./action";
import { RandomTable } from "./random-table";

export class Block {
    constructor(
        public readonly noteName: string,
        public readonly content: Action | RandomTable
    ) { }

    public get friendlyName() : string {
        return `${this.noteName}: ${this.content.name}`;
    }
    public get name() : string {
        return this.content.name;
    }
}