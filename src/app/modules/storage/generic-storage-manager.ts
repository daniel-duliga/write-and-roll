import { IEntity } from "./entity";

export class GenericStorageService<T extends IEntity> {
    constructor(private collectionName: string) { }

    create(entity: T) {
        localStorage.setItem(`${this.collectionName}/${entity.name}`, JSON.stringify(entity));
    }
    getAll(): T[] {
        const result: T[] = [];
        const allEntityNames = this.getAllNames();
        for (const path of allEntityNames) {
            let entity = this.get(path);
            if (entity) {
                result.push(entity);
            }
        }
        return result;
    }
    getAllNames(): string[] {
        const result = Object
            .keys(localStorage)
            .filter(x => x.startsWith(`${this.collectionName}/`))
            .map(x => x.replace(`${this.collectionName}/`, ''))
            .sort((a, b) => a.localeCompare(b));
        return result;
    }
    get(path: string): T | null {
        let result: T | null = null;

        const rawContent = localStorage.getItem(`${this.collectionName}/${path}`);
        if (rawContent !== null) {
            result = JSON.parse(rawContent);
        }

        return result;
    }
    update(entity: T) {
        let existingEntity = this.get(entity.name);
        if (existingEntity) {
            localStorage.setItem(`${this.collectionName}/${entity.name}`, JSON.stringify(entity));
        }
    }
    rename(oldPath: string, newPath: string) {
        let entity = this.get(oldPath);
        if (entity) {
            const oldPath = entity.name;
            this.delete(oldPath);
            entity.name = newPath;
            this.create(entity);
        }
    }
    delete(entityName: string) {
        localStorage.removeItem(`${this.collectionName}/${entityName}`);
    }
}