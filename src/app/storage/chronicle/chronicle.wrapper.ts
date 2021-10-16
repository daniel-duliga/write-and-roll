import { IEntity } from "../IEntity";

export class ChronicleWrapper implements IEntity {
    constructor(
        public name: string = '',
        public rawContent: string = ''
    ) { }
}