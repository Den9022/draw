import * as socketIo from 'socket.io';
import { SocketMessage } from "./socket-message";
import { isNullOrUndefined } from "util";
import * as http from 'http';

export type MessageHandler = (
    receivedMessage: SocketMessage,
    broadcast: (responseMessage: SocketMessage) => void,
    sendToUser: (userId: number, responseMessage: SocketMessage) => void
) => void;

export class ServerSocket {

    private static readonly EVENT_CONNECT_USER = 'connect-user';
    private static readonly EVENT_JOIN_ROOM = 'join-room';
    private static readonly EVENT_LEAVE_ROOM = 'leave-room';

    private static instance: ServerSocket;
    public static getInstance(): ServerSocket {
        if (isNullOrUndefined(ServerSocket.instance)) {
            throw new Error('ServerSocket is not instantiated yet!');
        }
        return ServerSocket.instance;
    }


    private socketServer: SocketIO.Server;
    private socketByUsers: Map<number, SocketIO.Socket>;
    private usersByRooms: Map<string, Set<number>>;
    // private usersByRooms: Map<string, number[]>;
    public handlersForRooms: Map<string, {event: string, handler: MessageHandler}[]>;

    constructor(httpServer: http.Server) {
        ServerSocket.instance = this;
        this.socketByUsers = new Map<number, SocketIO.Socket>();
        this.usersByRooms = new Map<string, Set<number>>();
        this.handlersForRooms = new Map<string, {event: string, handler: MessageHandler}[]>();
        this.socketServer = socketIo(httpServer);

        this.socketServer.on('connect', (socket: SocketIO.Socket) => {
            console.log('connecting');
            socket.once(ServerSocket.EVENT_CONNECT_USER, (socketMessage: SocketMessage) => {
                console.log('user is connecting: ' + socketMessage.senderId);
                this.socketByUsers.set(socketMessage.senderId, socket);
            });
            socket.on(ServerSocket.EVENT_JOIN_ROOM, this.handleEventJoinRoom.bind(this));
            socket.on(ServerSocket.EVENT_LEAVE_ROOM, this.handleEventLeaveRoom.bind(this));
        });

    }

    private handleEventJoinRoom(socketMessage: SocketMessage): void {
        const roomName = socketMessage.data.roomName;
        if (!this.usersByRooms.has(roomName)) {
            this.usersByRooms.set(roomName, new Set<number>());
        }
        this.usersByRooms.get(roomName).add(socketMessage.senderId);
        this.addRoomHandlersToUserSocket(roomName, socketMessage.senderId);
    }

    private addRoomHandlersToUserSocket(roomName: string, userId: number): void {
        const roomHandlers = this.handlersForRooms.get(roomName);
        const userSocket = this.socketByUsers.get(userId);
        roomHandlers.forEach(roomHandler => {
            //console.log(roomHandler.event);
            userSocket.on(roomName + '-' + roomHandler.event, (receivedMessage) => {
                const broadcast = (socketMessage: SocketMessage) => this.broadcast(roomName, roomHandler.event, socketMessage);
                const sendToUser = (targetUserId: number, socketMessage: SocketMessage, event?: string) => 
                    this.sendToUser(roomName, event ? event : roomHandler.event, targetUserId, socketMessage);
                roomHandler.handler(receivedMessage, broadcast, sendToUser);
            });
        });
    }

    private handleEventLeaveRoom(socketMessage: SocketMessage): void {
        const roomName = socketMessage.data.roomName;
        const roomPrefix = roomName + '-';
        const userSocket = this.socketByUsers.get(socketMessage.senderId);
        const eventsToRemove: string[] = Array.prototype.filter.call(userSocket.eventNames, (eventName: string) => eventName.startsWith(roomPrefix));
        eventsToRemove.forEach(eventName => userSocket.removeAllListeners(eventName));
        const usersLeftInRoom = Array.from(this.usersByRooms.get(roomName)).filter(userId => userId !== socketMessage.senderId);
        if (usersLeftInRoom.length === 0) {
            this.usersByRooms.delete(roomName);
        } else {
            this.usersByRooms.set(roomName, new Set<number>(usersLeftInRoom));
        }
    }

    public addHandler(roomName: string, event: string, handler: MessageHandler): void {
        const newHandler = (receivedMessage, broadcast, sendToUser) => {
            if (receivedMessage.fromServer) {
                return;
            }
            receivedMessage.fromServer = true;
            handler(receivedMessage, broadcast, sendToUser);
        }
        if (!this.handlersForRooms.has(roomName)) {
            this.handlersForRooms.set(roomName, []);
        }
        this.handlersForRooms.get(roomName).push({event, handler: newHandler});
    }

    private broadcast(roomName: string, event: string, socketMessage: SocketMessage): void {
        const userIds = this.usersByRooms.get(roomName);
        const userSockets: SocketIO.Socket[] = [];
        userIds.forEach(id => {
            const currentUserSocket = this.socketByUsers.get(id);
            userSockets.push(currentUserSocket);
        });

        userSockets.forEach(socket => {
            socket.emit(roomName + '-' + event, socketMessage);
        });
    }

    private sendToUser(roomName: string, event: string, userId: number, socketMessage: SocketMessage): void {
        console.log('-- send to user, event: ' + event);
        // console.log('this.socketByUsers\n', this.socketByUsers);
        const userSocket = this.socketByUsers.get(userId);
        userSocket.emit(roomName + '-' + event, socketMessage);
    }

}