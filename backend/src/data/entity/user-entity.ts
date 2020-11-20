import { BaseEntity } from "./base-entity";

export class UserEntity extends BaseEntity {

    public nickname: string;
    public email: string;
    public password: string;

}