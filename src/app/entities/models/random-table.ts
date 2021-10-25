import { Entity } from "./entity";

export class RandomTable extends Entity {
    constructor(
        public name: string = '',
        public rawContent: string = '',
        public content: any = {}
    ) {
        super(name, rawContent);
    }
}