import { ContextAttribute } from "./context-attribute";

export class Context {
    attributes: ContextAttribute[] = [];
    
    constructor(noteContent: string) {
        const lines = noteContent.split('\n');
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const rawLineContext = this.extractLineContext(lines[lineIndex]);
            this.addLineContext(rawLineContext);
        }
    }

    // static functions
    public static clone(source: Context): Context {
        let result = new Context('');
        for (const attribute of source.attributes) {
            result.attributes.push(attribute);
        }
        return result;
    }

    // public methods
    public getAttribute(key: string): any | null {
        return this.attributes.find(x => x.key === key)?.value;
    }
    public setAttribute(key: string, value: any) {
        let attribute = this.attributes.find(x => x.key === key);
        if(attribute) {
            attribute.value = value;
        } else {
            this.attributes.push(new ContextAttribute(key, value));
        }
    }

    // private methods
    private extractLineContext(line: string) {
        const attributes: string[] = [];
        const matches = line.matchAll(/@\w+\s*[\+\-]*=\s*[\d+\w+]+/g);
        for (const match of matches) {
            attributes.push(match.toString());
        }
        return attributes;
    }
    private addLineContext(rawAttributes: string[]) {
        for (const rawAttribute of rawAttributes) {
            const attributeSegments = rawAttribute.split(' ');
            let key = attributeSegments[0];
            key = key.slice(1, key.length);
            const operator = attributeSegments[1];

            let value: any = attributeSegments[2];
            if (!isNaN(value)) {
                value = +value;
            }

            let attribute: ContextAttribute | null = null;
            const attributeIndex = this.attributes.findIndex(x => x.key === key);
            if (attributeIndex === -1) {
                this.attributes.push(new ContextAttribute(key, value));
            } else {
                attribute = this.attributes[attributeIndex];
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
    }
}