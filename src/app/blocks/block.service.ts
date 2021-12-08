import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from './random-table';
import { ChronicleEntityService } from '../entities/services/chronicle-entity.service';
import { Action } from './action';
import { BlocksIndex } from './block-index';
import { Item } from '../entities/models/item';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  readonly index = new BlocksIndex();

  constructor(
    private papa: Papa,
  ) {}

  initialize(chronicles: Item[]) {
    for (const chronicle of chronicles) {
      this.processChronicle(chronicle);
    }
  }

  processChronicle(chronicle: Item) {
    const chronicleContent = chronicle.content;
    const blockMatches = chronicleContent.matchAll(/^```[\s]*(action|table) [\s\S]*?```$/gm);
    for (const blockMatch of blockMatches) {
      if (blockMatch) {
        this.addBlockToIndex(blockMatch);
      }
    }
  }

  private addBlockToIndex(blockMatch: RegExpMatchArray) {
    let content = blockMatch[0];

    const typeMatches = content.match(/[^```][\w]+\s+/);
    if (!typeMatches) {
      return;
    }
    const type = typeMatches[0].trim();
    
    const nameMatches = content.match(new RegExp(`[^(\`\`\`\\s*${type})].+`));
    if (!nameMatches) {
      return;
    }
    const name = nameMatches[0].trim();

    content = content.slice(content.indexOf('\n') + 1, content.lastIndexOf('\n'));

    switch (type) {
      case "action": {
        this.index.addAction(new Action(name, content));
        break;
      }
      case "table": {
        this.index.addRandomTable(new RandomTable(name, this.papa.parse(content).data));
        break;
      }
      default: {
        console.log(`Found unknown type ${type[0]}.`);
      }
    }
  }
}
