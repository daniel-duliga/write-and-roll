import { Injectable } from '@angular/core';
import { BlockService } from 'src/app/blocks/block.service';
import { Item } from '../models/item';
import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class ChronicleEntityService extends EntityService {
  constructor(private blockService: BlockService) {
    super('chronicles');
  }

  override create(item: Item): Item | null {
    const result = super.create(item);
    if(result) {
      this.blockService.processChronicle(item);
    }
    return result;
  }
}
