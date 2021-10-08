import { Dice } from './dice';

export class Tables {
    static rollOnTable(table: any): string {
        const tableData = table.data;
        const max = Tables.getMaxIndex(tableData);
        const roll = Dice.rollDice(1, max)
        const result = tableData.find((x: any[]) => this.checkMatch(x[0], roll[0]))[1]
        return result
    }

    private static getMaxIndex(tableData: any) {
        let max = tableData[tableData.length - 1][0];
        if (max.includes('-')) {
            max = max.split('-')[1];
        }
        if (max === '00') {
            max = 100;
        } else {
            max = +max;
        }
        return max;
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

