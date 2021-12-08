import { Injectable } from '@angular/core';
import { BlockService } from 'src/app/modules/blocks/block.service';
import { Item } from '../models/item';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class ChronicleEntityService extends EntityService {
  constructor(private blockService: BlockService) {
    super('chronicles');
  }

  override update(item: Item) {
    super.update(item);
    this.blockService.processChronicle(item);
  }
}
