import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  constructor(
    private api: ApiService
  ) { }

  run(action: string): string {
    const api = this.api;
    const result: string = eval(action);
    return result.toString();
  }
}
