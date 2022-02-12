import { Renderer2 } from '@angular/core';
import * as CodeMirror from 'codemirror';
import { LineWidget, Pos } from 'codemirror';
import { marked } from 'marked';

export class CodeMirrorManager {
    cm: CodeMirror.Editor;
    private lineWidgets: LineWidget[] = [];


    constructor(cm: CodeMirror.Editor) {
        this.cm = cm;
    }

    public processDocument() {
        // Parse as markdown
        const mdTokens = marked.lexer(this.cm.getValue());

        // Clean up old styles
        const lineCount = this.cm.lineCount();
        for (let i = 0; i <= lineCount; i++) {
            this.cm.removeLineClass(i, 'text', 'markdown-code');
            this.cm.removeLineClass(i, 'text', 'markdown-heading');
            this.cm.removeLineClass(i, 'text', 'markdown-heading-1');
            this.cm.removeLineClass(i, 'text', 'markdown-heading-2');
            this.cm.removeLineClass(i, 'text', 'markdown-heading-3');
            this.cm.removeLineClass(i, 'text', 'markdown-heading-4');
            this.cm.removeLineClass(i, 'text', 'markdown-heading-5');
            this.cm.removeLineClass(i, 'text', 'markdown-heading-6');
        }

        // Apply new styles
        let currentLineIndex = 0;
        for (const mdToken of mdTokens) {
            const blockLines = mdToken.raw.trim().split('\n')
            const startLineIndex = currentLineIndex;
            const endLineIndex = startLineIndex + blockLines.length - 1;

            switch (mdToken.type) {
                case 'code': {
                    // Style block background
                    for (let i = startLineIndex; i <= endLineIndex; i++) {
                        this.cm.addLineClass(i, 'text', 'markdown-code');
                    }
                    // Disable spell-check
                    this.cm.markText(
                        { line: startLineIndex, ch: 0 },
                        { line: endLineIndex, ch: blockLines[blockLines.length - 1].length },
                        { attributes: { 'spellcheck': 'false' } }
                    );
                    break;
                }
                case 'heading': {
                    for (let i = startLineIndex; i <= endLineIndex; i++) {
                        this.cm.addLineClass(i, 'text', `markdown-heading markdown-heading-${mdToken.depth}`);
                    }
                    break;
                }
                default:
                    break;
            }

            // Compute line index for next iteration
            currentLineIndex += (mdToken.raw.match(/\n/g) || []).length;
        }
    }

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

    // process line
    public processLine(
        line: string,
        lineIndex: number,
        changes: CodeMirror.EditorChange[] | null,
        renderer: Renderer2,
        getLinkCompletions: () => string[] = () => []
    ) {
        this.clearLineWidgets(lineIndex);
        this.renderLineImages(line, lineIndex, renderer);
        this.renderLineLinks(line, lineIndex);
        this.renderLineLinkCompletions(line, changes, getLinkCompletions);
    }
    private clearLineWidgets(lineIndex: number) {
        const lineWidgets = this.lineWidgets.splice(lineIndex, 1);
        if (lineWidgets.length === 1) {
            lineWidgets[0].clear();
        }
    }
    private renderLineImages(line: string, lineIndex: number, renderer: Renderer2) {
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
                renderer.setStyle(imageContainer, 'text-align', 'center');
                imageContainer.appendChild(image);

                const imageWidget = this.cm.addLineWidget(lineIndex, imageContainer);
                this.lineWidgets.push(imageWidget);
            }
        }
    }
    private renderLineLinks(line: string, lineIndex: number) {
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
    private renderLineLinkCompletions(
        line: string, changes: CodeMirror.EditorChange[] | null, getOptions: () => string[]) {
        if(!changes) { return; }
        
        // compute the index of the first char from the change (varies for insert and delete)
        let changeCharIndex = -1;
        if (changes[0].origin === '+input') {
            changeCharIndex = changes[0].to.ch;
        } else if (changes[0].origin === '+delete') {
            changeCharIndex = changes[0].from.ch - 1;
        }
        if (changeCharIndex == -1) { return; }

        // get the index of the next whitespace after the first char of the change 
        let whitespaceCharIndex = line.lastIndexOf(' ', changeCharIndex);
        if (whitespaceCharIndex === -1) {
            whitespaceCharIndex = 0;
        };

        const linkBrackets = line.slice(whitespaceCharIndex + 1, whitespaceCharIndex + 3);
        if (linkBrackets === '[[') {
            // get and filter completion options
            const filter = line.slice(whitespaceCharIndex + 3, changeCharIndex + 1);
            const options = getOptions().filter(x => x.toLowerCase().startsWith(filter.toLowerCase()));
            
            // show the autocompletion
            const cursor = this.cm.getCursor();
            const start = cursor.ch
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
                moveOnOverlap: true
            });
        }

        // append the end brackets to the line, if completion occurred
        const change = changes[0];
        if (change.origin === 'complete') {
            const line = this.cm.getLine(change.to.line);
            const bracketsPos = new Pos(change.to.line, line.lastIndexOf('[[', change.to.ch + 1) + 2);
            this.cm.replaceRange('', bracketsPos, change.to);
        }
    }

    // cursor position
    _cursorPosition: CodeMirror.Position | null = null;
    public get cursorPosition(): CodeMirror.Position | null {
        return this._cursorPosition;
    }
    public storeCursorPosition() {
        this._cursorPosition = this.cm.getCursor();
    }
    public restoreCursorPosition() {
        if (this._cursorPosition) {
            this.cm.setCursor(this._cursorPosition);
        }
    }
}