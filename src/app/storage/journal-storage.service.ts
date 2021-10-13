import { Injectable } from '@angular/core';
import { StorageServiceBase } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class JournalStorageService extends StorageServiceBase {
  constructor() {
    super('journal');
  }
}
