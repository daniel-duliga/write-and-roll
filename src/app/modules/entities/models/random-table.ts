import { Item } from "./item";

export class RandomTable extends Item {
    constructor(
        public path: string = '',
        public content: string = '',
        public parsedContent: string[][] = [],
    ) {
        super(path, content);
    }
}