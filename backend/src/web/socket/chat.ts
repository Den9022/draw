import { isNullOrUndefined } from "util";
import { ServerSocket } from "./server-socket";
import { SocketMessage } from "./socket-message";

export class Chat {

    private static instance: Chat;
    public static getInstance(): Chat {
        if (isNullOrUndefined(Chat.instance)) {
            const serverSocket = ServerSocket.getInstance();
            Chat.instance = new Chat(serverSocket);
        }
        return Chat.instance;
    }

    constructor(private serverSocket: ServerSocket) {
    }

    public setUpChatForRoom(roomName: string): void {
        if (isNullOrUndefined(roomName) || roomName.length === 0) {
            throw new Error('Cannot setup chat for anonymus room!');
        }

        console.log('setting up chat for room: ' + roomName);
        this.serverSocket.addHandler(roomName, 'chat', this.chatMessageHandler);
    }

    private chatMessageHandler(receivedMessage: SocketMessage, broadcast: (socketMessage: SocketMessage) => void): void {
        broadcast(receivedMessage);
    }



}