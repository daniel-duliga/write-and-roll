export class DiceWrapper {
    constructor(
        public sum: number = 0,
        public rolls: { [id: string]: number[] } = {}
    ) { }

    toString(): string {
        let result = '';
        for (const formula of Object.keys(this.rolls).reverse()) {
            result = result.concat(`${formula}(`);
            const dice = this.rolls[formula];
            for (const diceValue of dice) {
                result = result.concat(diceValue.toString(), ', ');
            }
            result = result
                .slice(0, result.length - 2)
                .concat(') + ');
        }
        result = result.slice(0, result.length - 3);
        return `${result} = ${this.sum}`;
    }
}