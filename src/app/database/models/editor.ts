import { PouchDbModelInterface } from '../core/pouchdb-model-interface';

export class Editor implements PouchDbModelInterface {
    _id: string = '';
    _rev: string = '';
    constructor(
        public noteId: string = ''
    ) { }
}