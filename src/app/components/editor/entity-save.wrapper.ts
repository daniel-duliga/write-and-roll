import { IEntity } from "src/app/storage/IEntity";

export class EntitySaveWrapper {
    constructor(
        public entity: IEntity,
        public oldName: string
    ) { }

    validate(): string {
        let errors = '';

        if (this.entity.name.trim() === '') {
            errors += 'Name is required.\n';
        } else if (this.entity.name.trim().endsWith('/')) {
            errors += 'Name cannot end with "/".\n';
        }

        if (this.entity.rawContent.trim() === '') {
            errors += 'Content is required.\n';
        }

        return errors;
    }
}