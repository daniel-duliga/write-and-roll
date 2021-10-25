import { Injectable } from '@angular/core';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class ActionEntityService extends EntityService {
  constructor() {
    super('actions');
  }
}
