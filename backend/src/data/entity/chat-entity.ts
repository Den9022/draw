import { BaseEntity } from "./base-entity";

export class ChatEntity extends BaseEntity {

    message: string;
    senderId: number;
    room: string;

}