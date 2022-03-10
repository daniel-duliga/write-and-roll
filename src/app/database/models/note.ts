import { PouchDbModelInterface } from "./pouchdb-model-interface";

export class Note implements PouchDbModelInterface {
    _id: string = '';
    _rev: string = '';

    constructor(
        public name: string
    ) { }
}