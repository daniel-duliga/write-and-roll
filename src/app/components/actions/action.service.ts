import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor() { }

  run(action: string): string {
    const result: string = eval(action);
    return result;
  }
}
