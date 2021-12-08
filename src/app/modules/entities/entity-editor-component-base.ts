import { ActivatedRoute } from "@angular/router";
import { Item } from "./models/item";
import { EntityService } from "./services/entity.service";

export class EntityEditorComponentBase {
    public entity: Item = new Item();

    protected getDataFromRoute(route: ActivatedRoute, entityService: EntityService) {
        route.paramMap.subscribe(params => {
            const name = params.get('name');
            if (name) {
                const entity = entityService.get(name);
                if (entity) {
                    this.entity = entity;
                }
            }
        });
    }
}