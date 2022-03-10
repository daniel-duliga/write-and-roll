import { PouchDbModelInterface } from "./pouchdb-model-interface";

export class Campaign implements PouchDbModelInterface {
    _id: string = '';
    _rev: string = '';

    constructor(
        public name: string
    ) { }
}