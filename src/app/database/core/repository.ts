import { PouchDbModelInterface } from "./pouchdb-model-interface";

export class Repository<T extends PouchDbModelInterface> {
    constructor(
        protected db: PouchDB.Database,
        private collection: string,
    ) { }

    async create(entity: T): Promise<T> {
        entity._id = `${this.collection}/${new Date().toISOString()}`;
        const response = await this.db.put(entity);
        entity._rev = response.rev;
        return entity;
    }
    
    async get(id: string): Promise<T> {
        return this.db.get(id);
    }
    
    async getAll(): Promise<T[]> {
        const result = await this.db.allDocs({
            include_docs: true,
            startkey: `${this.collection}/`,
            endkey: `${this.collection}/\ufff0`
        });
        if (result.rows.length > 0) {
            return result.rows.map(x => (x.doc as T));
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