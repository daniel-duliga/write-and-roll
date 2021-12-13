import { Block } from "./block";

export class BlockList {
    private blocks: Block[] = [];

    public get friendlyNames(): string[] {
        return this.blocks.map(x => x.friendlyName);
    }

    public addBlock(block: Block) {
        const existingBlockIndex = this.blocks.findIndex(
            x => x.noteName == block.noteName && x.content.name == block.content.name);
        if (existingBlockIndex !== -1) {
            this.blocks[existingBlockIndex] = block;
        } else {
            this.blocks.push(block);
        }
    }

    public getByFriendlyName(friendlyName: string): Block | null {
        return this.blocks.filter(x => x.friendlyName === friendlyName)[0];
    }

    public removeBlocksByNote(noteName: string) {
        this.blocks = this.blocks.filter(x => x.noteName !== noteName);
    }
}