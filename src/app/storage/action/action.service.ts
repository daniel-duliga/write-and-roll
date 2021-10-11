import { Injectable } from '@angular/core';
import { StorageServiceBase } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class ActionService extends StorageServiceBase {
  constructor() {
    super('actions');
  }
}
