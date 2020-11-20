import { BaseVo } from "./base-vo";
import { BaseEntity } from "../../data/entity/base-entity";

export class EntityVoConverter {

    // Ideiglenes megoldások
    public static toEntity(vo: BaseVo): any {
        return JSON.parse(JSON.stringify(vo));
    }

    public static toVo(entity: BaseEntity): any {
        return JSON.parse(JSON.stringify(entity));
    }

}