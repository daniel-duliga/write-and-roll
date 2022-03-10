import { PouchDbModelInterface } from "../../models/pouchdb-model-interface";
import { Repository } from "./repository";

export class RootEntityRepository<T extends PouchDbModelInterface> extends Repository<T> {
    constructor(
        db: PouchDB.Database,
        private collectionName: string
    ) {
        super(db);
    }

    create(entity: T): Promise<T> {
        return super.create(entity, this.collectionName);
    }
    getAll(): Promise<T[]> {
        return super.getAll(this.collectionName);
    }
}