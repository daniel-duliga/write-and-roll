import { IEntity } from "../IEntity";

export class RandomTableWrapper implements IEntity {
    constructor(
        public name: string = '',
        public rawContent: string = '',
        public content: any = {}
    ) { }
}