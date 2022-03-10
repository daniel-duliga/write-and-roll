import { PouchDbModelInterface } from "./pouchdb-model-interface";

export class System implements PouchDbModelInterface {
    _id: string = '';
    _rev: string = '';

    constructor(
        public name: string
    ) { }
}