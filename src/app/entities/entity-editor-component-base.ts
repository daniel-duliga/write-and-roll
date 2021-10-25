import { ActivatedRoute } from "@angular/router";
import { Entity } from "./models/entity";
import { EntityService } from "./services/entity.service";

export class EntityEditorComponentBase {
    public entity!: Entity;

    protected getDataFromRoute(route: ActivatedRoute, entityService: EntityService) {
        route.paramMap.subscribe(params => {
            const name = params.get('name');
            if (name) {
                this.entity = entityService.get(name);
            }
        });
    }
}