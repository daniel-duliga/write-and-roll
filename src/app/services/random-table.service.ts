import { Injectable } from '@angular/core';
import { StorageServiceBase } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RandomTableService extends StorageServiceBase {
  constructor() {
    super('tables');
  }  
}
