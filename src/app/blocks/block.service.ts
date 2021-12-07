import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { RandomTable } from './random-table';
import { ChronicleEntityService } from '../entities/services/chronicle-entity.service';
import { Action } from './action';
import { BlocksIndex } from './block-index';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  readonly index = new BlocksIndex();

  constructor(
    private chronicleService: ChronicleEntityService,
    private papa: Papa) {}

  initialize() {
    const chroniclePaths = this.chronicleService.getAllNonEmpty();
    for (const chroniclePath of chroniclePaths) {
      const chronicle = this.chronicleService.get(chroniclePath);
      if (!chronicle?.content) {
        continue;
      }
      const chronicleContent = chronicle.content;

      const blockMatches = chronicleContent.matchAll(/^```[\s]*(action|table) [\s\S]*?```$/gm);
      for (const blockMatch of blockMatches) {
        if (blockMatch) {
          this.parseBlock(blockMatch);
        }
      }
    }
    
    console.log(this.index);
  }

  private parseBlock(blockMatch: RegExpMatchArray) {
    const blockContent = blockMatch[0];

    const typeMatches = blockContent.match(/[^```][\w]+\s+/);
    if (!typeMatches) {
      return;
    }
    const type = typeMatches[0].trim();
    
    const nameMatches = blockContent.match(new RegExp(`[^(\`\`\`\\s*${type})].+`));
    if (!nameMatches) {
      return;
    }
    const name = nameMatches[0].trim();

    const content = blockContent.slice(blockContent.indexOf('\n') + 1, blockContent.lastIndexOf('\n'));

    switch (type) {
      case "action": {
        this.index.actions.push(new Action(name, content));
        break;
      }
      case "table": {
        this.index.randomTables.push(new RandomTable(name, this.papa.parse(content).data));
        break;
      }
      default: {
        console.log(`Found unknown type ${type[0]}.`);
      }
    }
  }
}
