import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from './random-table';
import { Action } from './action';
import { Item } from '../..//modules/entities/models/item';
import { Block } from './block';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private actions: Action[];
  private randomTables: RandomTable[];

  constructor(
    private papa: Papa,
  ) {
    this.actions = [];
    this.randomTables = [];
  }

  //#region public methods
  initialize(chronicles: Item[]) {
    for (const chronicle of chronicles) {
      this.addBlocksFromChronicle(chronicle);
    }
    console.log(this);
  }

  addBlocksFromChronicle(chronicle: Item) {
    const blocks = this.getBlocksFromChronicle(chronicle);
    this.updateIndex(blocks, chronicle);
  }

  removeBlocksByChronicle(chronicle: string) {
    this.actions = this.actions.filter(x => x.chronicle !== chronicle);
    this.randomTables = this.randomTables.filter(x => x.chronicle !== chronicle);
  }

  //#endregion

  //#region private methods
  private getBlocksFromChronicle(chronicle: Item): Block[] {
    const result: Block[] = [];

    const chronicleContent = chronicle.content;
    const blockMatches = chronicleContent.matchAll(/^```[\s]*(action|table) [\s\S]*?```$/gm);
    for (const blockMatch of blockMatches) {
      if (blockMatch) {
        const block = this.parseBlock(blockMatch[0], chronicle.path);
        if (block) {
          result.push(block);
        }
      }
    }

    return result;
  }

  private parseBlock(content: string, chronicle: string): Block | null {
    const typeMatches = content.match(/[^```][\w]+\s+/);
    if (!typeMatches) {
      return null;
    }
    const type = typeMatches[0].trim();

    const nameMatches = content.match(new RegExp(`[^(\`\`\`\\s*${type})].+`));
    if (!nameMatches) {
      return null;
    }
    const name = nameMatches[0].trim();

    content = content.slice(content.indexOf('\n') + 1, content.lastIndexOf('\n'));

    return new Block(name, content, type, chronicle);
  }

  private updateIndex(blocks: Block[], chronicle: Item) {
    this.removeBlocksByChronicle(chronicle.path);
    this.addBlocks(blocks);
  }

  private addBlocks(blocks: Block[]) {
    for (const block of blocks) {
      switch (block.type) {
        case "action": {
          this.addAction(new Action(block.name, block.content, block.chronicle));
          break;
        }
        case "table": {
          this.addRandomTable(new RandomTable(block.name, this.papa.parse(block.content).data, block.chronicle));
          break;
        }
        default: {
          console.log(`Found unknown type ${block.type}.`);
        }
      }
    }
  }

  private addAction(action: Action) {
    const existingActionIndex = this.actions.findIndex(x => x.chronicle == action.chronicle && x.name == action.name);
    if (existingActionIndex !== -1) {
      this.actions[existingActionIndex] = action;
    } else {
      this.actions.push(action);
    }
  }

  private addRandomTable(randomTable: RandomTable) {
    const existingRandomTableIndex = this.randomTables.findIndex(x => x.chronicle == randomTable.chronicle && x.name == randomTable.name);
    if (existingRandomTableIndex !== -1) {
      this.randomTables[existingRandomTableIndex] = randomTable;
    } else {
      this.randomTables.push(randomTable);
    }
  }
  //#endregion
}
