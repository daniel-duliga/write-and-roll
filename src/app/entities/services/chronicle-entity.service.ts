import { Injectable } from '@angular/core';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class ChronicleEntityService extends EntityService {
  constructor() {
    super('chronicles');
  }
}
