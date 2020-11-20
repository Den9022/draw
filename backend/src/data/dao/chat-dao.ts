import { isNullOrUndefined } from "util";
import { ChatEntity } from "../entity/chat-entity";
import { DatabaseConnection } from "../database/database-connection";

export class ChatDao {

    private static instance: ChatDao;
    public static getInstance(): ChatDao {
        if (isNullOrUndefined(ChatDao.instance)) {
            const dbConnection = DatabaseConnection.getInstance();
            ChatDao.instance = new ChatDao(dbConnection);
        }
        return ChatDao.instance;
    }

    constructor(private dbConnection: DatabaseConnection) {
    }

    public async saveMessage(chatEntity: ChatEntity): Promise<any> {
        const sql = `
            INSERT INTO thesis.CHAT_MESSAGES
            (message, senderId, room)
            VALUES (?, ?, ?);
        `;
        return await this.dbConnection.runSql(sql, [chatEntity.message, chatEntity.senderId, chatEntity.room]);
    }

    public async findMessagesOfRoom(room: string): Promise<ChatEntity[]> {
        const sql = `
            SELECT * FROM thesis.CHAT_MESSAGES
            WHERE room = ?;
        `;
        return await this.dbConnection.runSql(sql, [room]);
    }



}