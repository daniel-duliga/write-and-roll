import { Injectable } from '@angular/core';
import { DiceUtil } from '../trpg/dice/dice.util';
import { DiceWrapper } from '../trpg/dice/dice.wrapper';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }

  rollDice(formula: string): number {
    return DiceUtil.rollDiceFormula(formula).sum;
  }
}
