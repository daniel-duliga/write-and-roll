import { PouchDbModelInterface } from "./models/pouchdb-model-interface";

export class Repository<T extends PouchDbModelInterface> {
    constructor(
        private db: PouchDB.Database,
        private collection: string,
    ) { }

    async create(entity: T, prefix: string = ''): Promise<T> {
        entity._id = this.collection;
        if (prefix) {
            entity._id = entity._id.concat(`/${prefix}`);
        }
        entity._id = entity._id.concat(`/${new Date().toISOString()}`);
        
        const response = await this.db.put(entity);
        
        entity._rev = response.rev;
        
        return entity;
    }
    
    async get(id: string): Promise<T> {
        return this.db.get(id);
    }
    
    async getAll(prefix: string = ''): Promise<T[]> {
        let startkey = this.collection;
        let endkey = this.collection;
        if(prefix) {
            startkey = startkey.concat(`/${prefix}`);
            endkey = endkey.concat(`/${prefix}`);
        }
        endkey = endkey.concat('\ufff0');
        
        const result = await this.db.allDocs({
            include_docs: true,
            startkey: startkey,
            endkey: endkey
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