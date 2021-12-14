import { EditorMode } from "src/app/components/editor/editor.component";

export class Editor {
    constructor(
        public id: string,
        public notePath: string,
        public mode: EditorMode,
        public minimized: boolean
    ) { }
}