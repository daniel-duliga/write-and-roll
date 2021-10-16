import { IEntity } from "../core/IEntity";

export class Chronicle implements IEntity {
    constructor(
        public name: string = '',
        public rawContent: string = ''
    ) { }
}