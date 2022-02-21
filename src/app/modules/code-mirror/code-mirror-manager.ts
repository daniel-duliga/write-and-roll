import { Renderer2 } from '@angular/core';
import * as CodeMirror from 'codemirror';
import { LineWidget, Pos } from 'codemirror';
import { Context } from '../actions/context';

export class CodeMirrorManager {
    cm: CodeMirror.Editor;

    constructor(cm: CodeMirror.Editor) {
        this.cm = cm;
    }

    // line processing
    private lineWidgets: LineWidget[] = [];
    private lastAutocompletePrefix: string | null = null;
    public processLine(
        line: string,
        lineIndex: number,
        changes: CodeMirror.EditorChange[] | null,
        renderer: Renderer2,
        allLinks: string[],
        allAttributes: string[]
    ) {
        this.clearLineWidgets(lineIndex);
        this.renderImages(line, lineIndex, renderer);
        this.renderLinks(line, lineIndex);
        this.renderMarkdownHeaders(lineIndex);
        this.renderContextAttributes(line, lineIndex);
        if (changes) {
            this.renderAutocomplete(line, changes, allLinks, '[[');
            this.renderAutocomplete(line, changes, allAttributes, '@');
            if(this.lastAutocompletePrefix) {
                this.handleAutocompleteSelection(changes, this.lastAutocompletePrefix);
            }
        }
    }
    public handleAutocompleteSelection(changes: CodeMirror.EditorChange[], prefix: string) {
        const change = changes[0];
        if (change.origin === 'complete') {
            const line = this.cm.getLine(change.to.line);
            const prefixPosition = new Pos(change.to.line, line.lastIndexOf(prefix, change.to.ch + 1) + prefix.length);
            this.cm.replaceRange('', prefixPosition, change.to);
            this.lastAutocompletePrefix = null;
        }
    }

    private clearLineWidgets(lineIndex: number) {
        const lineWidgets = this.lineWidgets.splice(lineIndex, 1);
        if (lineWidgets.length === 1) {
            lineWidgets[0].clear();
        }
    }
    private renderImages(line: string, lineIndex: number, renderer: Renderer2) {
        const images = line.matchAll(/!\[\w*\]\(\w+\:\/\/[\w\.\/\-]+\)/g);
        for (const image of images) {
            let imageUrl = image.toString().match(/\(.*\)/g)?.toString();
            if (imageUrl) {
                imageUrl = imageUrl.slice(1, imageUrl.length - 1);

                let image: HTMLElement = renderer.createElement('img');
                renderer.setAttribute(image, 'src', imageUrl);
                renderer.setStyle(image, 'max-height', '1024px');
                renderer.setStyle(image, 'max-width', '100%');

                let imageContainer: HTMLElement = renderer.createElement('div');
                renderer.setStyle(imageContainer, 'text-align', 'left');
                imageContainer.appendChild(image);

                const imageWidget = this.cm.addLineWidget(lineIndex, imageContainer);
                this.lineWidgets.push(imageWidget);
            }
        }
    }
    private renderLinks(line: string, lineIndex: number) {
        const linkMatches = line.matchAll(/\[\[(\w*\s*\d*)+\]\]/g);
        for (const linkMatch of linkMatches) {
            const linkIndexInLine = linkMatch.index ?? 0;
            const link = linkMatch[0].toString();
            const address = link.slice(2, link.length - 2);
            this.cm.markText(
                { line: lineIndex, ch: linkIndexInLine },
                { line: lineIndex, ch: linkIndexInLine + link.length },
                {
                    className: 'markdown-link',
                    attributes: {
                        'notePath': link,
                        'onClick': `openLink('${address}')`
                    },
                }
            );
        }
    }
    private renderMarkdownHeaders(lineIndex: number) {
        const lineTokens = this.cm.getLineTokens(lineIndex);
        if (lineTokens.find(x => x.type?.includes('header'))) {
            this.cm.addLineClass(lineIndex, 'text', 'md-header');
        }
    }
    private renderContextAttributes(line: string, lineIndex: number) {
        const attributes = Context.extractLineContext(line);
        let startChar = 0;
        for (const attribute of attributes) {
            startChar = line.indexOf(attribute, startChar);
            const endChar = startChar + attribute.length;
            this.cm.markText(
                { line: lineIndex, ch: startChar },
                { line: lineIndex, ch: endChar },
                {
                    className: "context-attribute"
                }
            );
        }
    }

    // actions
    public toggleFoldAllLines() {
        const linesCount = this.cm.lineCount();
        let currentMode: "fold" | "unfold" = "fold";
        for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
            if (this.cm.isFolded(new Pos(lineIndex))) {
                currentMode = "unfold";
                break;
            }
        }
        for (let lineIndex = 0; lineIndex < linesCount; lineIndex++) {
            this.cm.foldCode(lineIndex, undefined, currentMode);
        }
    }

    // auto-complete
    private renderAutocomplete(line: string, changes: CodeMirror.EditorChange[], options: string[], prefix: string) {
        // compute the index of the first char from the word being changed (varies for insert and delete)
        let changeCharIndex = -1;
        if (changes[0].origin === '+input') {
            changeCharIndex = changes[0].to.ch;
        } else if (changes[0].origin === '+delete') {
            changeCharIndex = changes[0].from.ch - 1;
        }
        if (changeCharIndex == -1) {
            return;
        }

        // get the index of the next whitespace after the first char of the change 
        let startCharIndex = line.lastIndexOf(' ', changeCharIndex);
        if (startCharIndex === -1) {
            startCharIndex = -1;
        };

        // check if the current word being changed starts with the prefix
        const possiblePrefix = line.slice(startCharIndex + 1, startCharIndex + 1 + prefix.length);
        if (possiblePrefix !== prefix) {
            return;
        }

        // if the prefix is found, save it
        this.lastAutocompletePrefix = prefix;
        
        // get the filter (the content after the prefix)
        const filter = line.slice(startCharIndex + 1 + prefix.length, changeCharIndex + 1);
        if (filter === null) {
            return;
        }

        // filter the options
        options = options.filter(x => x.toLowerCase().startsWith(filter.toLowerCase()));

        // show autocomplete
        const cursor = this.cm.getCursor();
        const start = cursor.ch;
        const end = cursor.ch;
        this.cm.showHint({
            hint: () => {
                return {
                    list: options,
                    from: CodeMirror.Pos(cursor.line, start),
                    to: CodeMirror.Pos(cursor.line, end)
                };
            },
            completeSingle: false,
            moveOnOverlap: true,
        });
    }
}