import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from './random-table';
import { Action } from './action';
import { Item } from '../..//modules/entities/models/item';
import { Block } from './block';
import { BlockList } from './blockList';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  public actions: BlockList;
  public randomTables: BlockList;

  constructor(
    private papa: Papa,
  ) {
    this.actions = new BlockList();
    this.randomTables = new BlockList();
  }

  //#region public methods
  initialize(chronicles: Item[]) {
    for (const chronicle of chronicles) {
      this.removeBlocksByChronicle(chronicle.path);
      this.addBlocksFromChronicle(chronicle);
    }
    console.log(this);
  }

  addBlocksFromChronicle(chronicle: Item) {
    const blockMatches = chronicle.content.matchAll(/^```[\s]*(action|table) [\s\S]*?```$/gm);
    for (const blockMatch of blockMatches) {
      if (blockMatch) {
        let content = blockMatch[0];
        
        const type = this.getBlockType(content);
        if (!type) {
          console.log("Cannot find block type.");
          return;
        }
        
        const name = this.getBlockName(content, type);
        if(!name) {
          console.log("Cannot find block name.");
          return;
        }
        
        content = content.slice(content.indexOf('\n') + 1, content.lastIndexOf('\n'));

        switch (type) {
          case "action": {
            this.actions.addBlock(new Block(chronicle.path, new Action(name, content)));
            break;
          }
          case "table": {
            this.randomTables.addBlock(new Block(chronicle.path, new RandomTable(name, this.papa.parse(content).data)));
            break;
          }
          default: {
            console.log(`Found unknown type ${type}.`);
          }
        }
      }
    }
  }

  removeBlocksByChronicle(chronicleName: string) {
    this.actions.removeBlocksByChronicle(chronicleName);
    this.randomTables.removeBlocksByChronicle(chronicleName);;
  }
  //#endregion

  //#region private methods
  private getBlockType(content: string): string | null {
    const typeMatches = content.match(/[^```][\w]+\s+/);
    if (!typeMatches) {
      console.log("Block type not found.");
      return null;
    }
    return typeMatches[0].trim();
  }

  private getBlockName(content: string, type: string): string | null {
    const nameMatches = content.match(new RegExp(`[^(\`\`\`\\s*${type})].+`));
    if (!nameMatches) {
      console.log("Block name not found.");
      return null;
    }
    return nameMatches[0].trim();
  }

  
  //#endregion
}
