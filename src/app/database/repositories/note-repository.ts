import { Repository } from "../core/repository";
import { Note, NoteType } from "../models/note";

export class NoteSelector {
    type?: NoteType | null = null;
    name?: string | null = null;
}

export class NotRepository extends Repository<Note> {
    async first(selector: NoteSelector): Promise<Note | null> {
        const result = await this.db.find({
            selector: selector
        });
        if (result.docs.length > 0) {
            return (result.docs[0] as Note);
        } else {
            return null;
        }
    }
    async where(selector: NoteSelector): Promise<Note[]> {
        const result = await this.db.find({
            selector: selector
        });
        if (result.docs.length > 0) {
            return result.docs.map(x => (x as Note));
        } else {
            return [];
        }
    }
}