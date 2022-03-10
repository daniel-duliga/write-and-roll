import { Note } from "../models/note";
import { Repository } from "./generic/repository";

export class SystemNoteRepository extends Repository<Note> {
    constructor(db: PouchDB.Database) {
        super(db);
    }

    create(entity: Note, systemId: string): Promise<Note> {
        return super.create(entity, `${systemId}/notes`);
    }
    getAll(systemId: string): Promise<Note[]> {
        return super.getAll(`${systemId}/notes`);
    }
}