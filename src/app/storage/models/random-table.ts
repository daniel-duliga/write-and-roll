import { IEntity } from "../core/IEntity";

export class RandomTable implements IEntity {
    constructor(
        public name: string = '',
        public rawContent: string = '',
        public content: any = {}
    ) { }
}