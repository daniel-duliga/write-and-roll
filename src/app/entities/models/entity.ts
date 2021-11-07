export class Entity {
    constructor(
        public name: string = '',
        public rawContent: string = '',
    ) { }

    validate(): string {
        let errors = '';

        if (this.name.trim() === '') {
            errors += 'Name is required.\n';
        } else if (this.name.trim().endsWith('/')) {
            errors += 'Name cannot end with "/".\n';
        }

        // if (this.rawContent.trim() === '') {
        //     errors += 'Content is required.\n';
        // }

        return errors;
    }
}