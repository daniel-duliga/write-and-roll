import { Injectable } from '@angular/core';
import { NoteContext } from './note-context';
import { NoteContextAttribute } from './note-context-attribute';

@Injectable({
  providedIn: 'root'
})
export class NoteContextService {
  constructor() { }

  processNote(noteContent: string): NoteContext {
    let context = new NoteContext([]);
    const lines = noteContent.split('\n');
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const rawLineContext = this.extractLineContext(lines[lineIndex]);
      context = this.updateContext(context, rawLineContext);
    }
    return context;
  }

  private extractLineContext(line: string) {
    const attributes: string[] = [];
    const matches = line.matchAll(/@\w+\s*[\+\-]*=\s*[\d+\w+]+/g);
    for (const match of matches) {
      attributes.push(match.toString());
    }
    return attributes;
  }

  private updateContext(context: NoteContext, rawAttributes: string[]): NoteContext {
    for (const rawAttribute of rawAttributes) {
      const attributeSegments = rawAttribute.split(' ');
      let key = attributeSegments[0];
      key = key.slice(1, key.length);
      const operator = attributeSegments[1];

      let value: any = attributeSegments[2];
      if (!isNaN(value)) {
        value = +value;
      }

      let attribute: NoteContextAttribute | null = null;
      const attributeIndex = context.attributes.findIndex(x => x.key === key);
      if (attributeIndex === -1) {
        context.attributes.push(new NoteContextAttribute(key, value));
      } else {
        attribute = context.attributes[attributeIndex];
        if (attribute) {
          switch (operator) {
            case '=':
              attribute.value = value;
              break;
            case '+=':
              attribute.value += value;
              break;
            case '-=':
              attribute.value -= value;
              break;
            default:
              break;
          }
        }
      }
    }
    return context;
  }
}
