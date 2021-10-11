import { IEntity } from "../IEntity";

export class JournalWrapper implements IEntity {
    constructor(
        public name: string = '',
        public rawContent: string = ''
    ) { }
}