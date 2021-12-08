export class Block {
    constructor(
        public readonly name: string,
        public readonly content: string,
        public readonly type: string,
        public readonly chronicle: string,
    ) { }
}