export class Note {
    constructor(
        public path: string = '',
        public content: string = '',
        public favorite: boolean = false,
    ) { }

    compareTo(target: Note): number {
        if(this.favorite && !target.favorite) {
            return -1;
        } else if (this.favorite && target.favorite || !this.favorite && !target.favorite) {
            return 0;
        } else {
            return 1;
        }
    }
}