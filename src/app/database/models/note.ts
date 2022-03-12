import { PouchDbModelInterface } from "../core/pouchdb-model-interface";

export type NoteType = 'note' | 'random-table' | 'action';
export class Note implements PouchDbModelInterface {
    _id: string = '';
    _rev: string = '';

    constructor(
        public type: NoteType = 'note',
        public name: string = '',
        public content: string = '',
    ) { }
}