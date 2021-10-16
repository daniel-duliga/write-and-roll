import { Injectable } from '@angular/core';
import { StorageServiceBase } from '../core/storage-service-base';

@Injectable({
  providedIn: 'root'
})
export class ActionStorageService extends StorageServiceBase {
  constructor() {
    super('actions');
  }
}
