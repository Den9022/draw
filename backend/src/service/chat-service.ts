import { isNullOrUndefined } from "util";
import { ChatDao } from "src/data/dao/chat-dao";
import { UserDao } from "src/data/dao/user-dao";
import { ChatVo } from "./vo/chat-vo";
import { ChatEntity } from "src/data/entity/chat-entity";

export class ChatService {

    private static instance: ChatService;
    public static getInstance(): ChatService {
        if (isNullOrUndefined(ChatService.instance)) {
            const chatDao = ChatDao.getInstance();
            const userDao = UserDao.getInstance();
            ChatService.instance = new ChatService(chatDao, userDao);
        }
        return ChatService.instance;
    }

    constructor(private chatDao: ChatDao, private userDao: UserDao) {

    }

    public async saveMessage(chatVo: ChatVo): Promise<any> {
        const chatEntity = new ChatEntity();
        chatEntity.message = chatVo.message;
        chatEntity.senderId = chatVo.senderId;
        chatEntity.room = chatVo.room;
        return await this.chatDao.saveMessage(chatEntity);
    }

    public async getMessagesOfRoom(room: string): Promise<ChatVo[]> {
        const chatEntities = await this.chatDao.findMessagesOfRoom(room);
        const senderIds = chatEntities.map(chatEntity => chatEntity.senderId);
        const senderUsers = await this.userDao.findAllById(senderIds);

        const chatVos: ChatVo[] = [];
        for (let chatEntity of chatEntities) {
            const chatVo = new ChatVo();
            chatVo.message = chatEntity.message;
            chatVo.senderId = chatEntity.senderId;
            chatVo.id = chatEntity.id;
            chatVo.senderName = senderUsers.find(user => user.id === chatEntity.senderId).nickname;
            chatVos.push(chatVo);
        }

        return chatVos;
    }

}