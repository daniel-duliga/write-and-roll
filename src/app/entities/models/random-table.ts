import { Item } from "./item";

export class RandomTable extends Item {
    constructor(
        public path: string = '',
        public rawContent: string = '',
        public content: any = {}
    ) {
        super(path, rawContent);
    }
}