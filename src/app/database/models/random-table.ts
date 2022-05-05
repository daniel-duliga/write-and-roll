import { DiceUtil } from "src/app/modules/dice/dice.util";
import { PouchDbModelInterface } from "../core/pouchdb-model-interface";

export class RandomTable implements PouchDbModelInterface {
    
    _id: string = '';
    _rev: string = '';

    constructor(
        public name: string,
        public lines: RandomTableLine[]
    ) { }

}

export class RandomTableLine {
    
    constructor(
        public index: string,
        public value: string
    ) { }

}