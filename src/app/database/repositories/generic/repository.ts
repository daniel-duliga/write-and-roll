import { PouchDbModelInterface } from '../../models/pouchdb-model-interface';

export class Repository<T extends PouchDbModelInterface> {
    constructor(
        private db: PouchDB.Database
    ) { }

    async create(entity: T, prefix: string): Promise<T> {
        entity._id = `${prefix}/${new Date().toISOString()}`;
        const response = await this.db.put(entity);
        entity._rev = response.rev;
        return entity;
    }
    async get(id: string): Promise<T> {
        return this.db.get(id);
    }
    async getAll(prefix: string): Promise<T[]> {
        const foo = await this.db.allDocs({
            include_docs: true,
            startkey: prefix,
            endkey: `${prefix}\ufff0`
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