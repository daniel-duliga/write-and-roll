import { Injectable } from '@angular/core';
import { ChronicleEntityService } from '../entities/services/chronicle-entity.service';

@Injectable({
  providedIn: 'root'
})
export class NewEntityService {
  constructor(private chronicleService: ChronicleEntityService) { }

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

    console.log(`Found ${type} '${name}'`);

    // switch (type) {
    //   case "action": {
    //     break;
    //   }
    //   case "table": {
    //     break;
    //   }
    //   default: {
    //     console.log(`Found unknown type ${type[0]}.`);
    //   }
    // }
  }
}
