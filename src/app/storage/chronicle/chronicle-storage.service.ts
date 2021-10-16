import { Injectable } from '@angular/core';
import { StorageServiceBase } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChronicleStorageService extends StorageServiceBase {
  constructor() {
    super('chronicles');
  }
}
