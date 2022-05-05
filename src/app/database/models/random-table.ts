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
        index: string,
        value: string
    ) { }

}