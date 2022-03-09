import { ModelInterface } from "./model-interface";

export class Campaign implements ModelInterface {
    _id: string = '';
    _rev: string = '';

    constructor(
        public name: string
    ) { }
}