import { PouchDbModelInterface } from "../core/pouchdb-model-interface";

export class Template implements PouchDbModelInterface {
    _id: string = '';
    _rev: string = '';

    constructor(
        public name: string = '',
        public content: string = ''
    ) { }
}