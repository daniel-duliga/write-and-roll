import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  public executionInProgress = false;

  constructor() { }
}
