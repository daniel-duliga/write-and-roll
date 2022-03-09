import { ModelInterface } from "./models/model-interface";
import PouchDB from 'pouchdb';

export class Repository<T extends ModelInterface> {
    constructor(
        private db: PouchDB.Database,
        private prefix: string
    ) { }

    async create(entity: T): Promise<T> {
        entity._id = `${this.prefix}/${new Date().toISOString()}`;
        const response = await this.db.put(entity);
        entity._rev = response.rev;
        return entity;
    }
    async get(id: string): Promise<T> {
        return this.db.get(id);
    }
    async getAll(): Promise<T[]> {
        const foo = await this.db.allDocs({
            include_docs: true,
            startkey: this.prefix,
            endkey: `${this.prefix}\ufff0`
        });
        if (foo.rows.length > 0) {
            return foo.rows.map(x => (x.doc as T));
        } else {
            return [];
        }
    }
    async update(entity: T): Promise<T> {
        const response = await this.db.put(entity);
        entity._rev = response.rev;
        return entity;
    }
    async delete(entity: T): Promise<T> {
        const response = await this.db.remove(entity);
        entity._rev = response.rev;
        return entity;
    }
}