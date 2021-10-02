export class Dice {
  
  static rollDiceFormula(formula: string): DiceRoll {
    const operatorsRegEx = /[+]/g

    let diceArray = formula.split(operatorsRegEx)
    diceArray = diceArray.map((element) => element.trim())

    // Not used for now:
    // const operators = formula.match(operatorsRegEx)

    const result = new DiceRoll()
    while (diceArray.length > 0) {
      const formulaPart = diceArray.pop()
      if (formulaPart) {
        const formulaParts = formulaPart.split('d')
        if (formulaParts.length > 0) {
          const count = +formulaParts[0]
          const dice = formulaParts.length > 1 ? +formulaParts[1] : 1
          const diceRolls = Dice.rollDice(count, dice)
          result.sum += diceRolls.reduce((sum, current) => sum + current);
          result.rolls[formulaPart] = diceRolls;
        }
      }
    }

    return result
  }

  static rollDice(count: number, dice: number): number[] {
    let result: number[] = [];
    if (dice === 1) {
      result.push(+count);
    } else {
      while (count > 0) {
        const roll = 1 + Math.floor(Math.random() * dice)
        result.push(roll)
        count--
      }
    }
    return result
  }
}

class DiceRoll {
  constructor(
    public sum: number = 0,
    public rolls: { [id: string]: number[] } = {}
  ) { }
}