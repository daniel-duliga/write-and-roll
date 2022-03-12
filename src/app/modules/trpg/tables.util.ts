import { DiceUtil } from './dice/dice.util';

export class TablesUtil {
    static rollOnTable(table: string[][]): string {
        const max = TablesUtil.getMaxIndex(table);
        const roll = DiceUtil.rollDice(1, max);
        const match = table.find((x: string[]) => this.checkMatch(x[0], roll[0]));
        if (match) {
            return match[1];
        } else {
            return '';
        }
    }
    private static getMaxIndex(tableData: string[][]): number {
        let result = 0;

        let max: string = tableData[tableData.length - 1][0];
        if (max.includes('-')) {
            max = max.split('-')[1];
        }

        if (max === '00') {
            result = 100;
        } else {
            result = +max;
        }

        return result;
    }
    private static checkMatch(index: string, roll: number): boolean {
        if (index.includes('-')) {
            const ranges = index.split('-').map(x => +x)
            return ranges[0] <= roll && roll <= ranges[1]
        } else {
            return index === roll.toString()
        }
    }
}

