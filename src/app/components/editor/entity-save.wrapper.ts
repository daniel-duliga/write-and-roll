import { IEntity } from "src/app/storage/IEntity";

export class EntitySaveWrapper {
    constructor(
        public entity: IEntity,
        public oldName: string
    ) { }
}