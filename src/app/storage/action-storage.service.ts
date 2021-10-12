import { Injectable } from '@angular/core';
import { StorageServiceBase } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ActionStorageService extends StorageServiceBase {
  constructor() {
    super('actions');
  }
}
