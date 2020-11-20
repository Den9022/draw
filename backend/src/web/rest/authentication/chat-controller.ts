import { isNullOrUndefined } from "util";
import { ChatService } from "../../../service/chat-service";
import { DataResponse } from "../data-response";
import { ChatVo } from "../../../service/vo/chat-vo";

export class ChatController {

    private static instance: ChatController;
    public static getInstance(): ChatController {
        if (isNullOrUndefined(ChatController.instance)) {
            const chatService = ChatService.getInstance();
            ChatController.instance = new ChatController(chatService);
        }
        return ChatController.instance;
    }

    constructor(private chatService: ChatService) {
    }

    public readMessagesOfRoom(request: any, response: any): void {
        const room = request.query.roomName;
        if (isNullOrUndefined(room) || room.length === 0) {
            response.send(DataResponse.withError('You must specify a room name to read the chat messages!'));
            return;
        }

        this.chatService.getMessagesOfRoom(room)
            .then((messages: ChatVo[]) => {
                response.send(DataResponse.withData(messages));
            })
            .catch(error => {
                console.error(`--- error while reading chat messages for room: ${room}\n`, error);
                response.send(DataResponse.withError(error.toString()));
            });
    }

}