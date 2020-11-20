import { BaseVo } from "./base-vo";

export class ChatVo extends BaseVo {

    message: string;
    senderId: number;
    senderName: string;
    room: string;

}