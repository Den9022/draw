import { BaseEntity } from "./base-entity";

export class RoomEntity extends BaseEntity {

    public name: string;
    public creatorId: number;
    public available: boolean;

}