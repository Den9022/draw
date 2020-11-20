import { isNullOrUndefined } from "util";
import { ServerSocket } from "./server-socket";
import { Chat } from "./chat";
import { SocketMessage } from "./socket-message";
import { GameService } from "../../service/game-service";
import { PlayerVo } from "../../service/vo/player-vo";
import { UserVo } from "../../service/vo/user-vo";

export class Room {

    private static EVENT_START_GAME = 'start-game';
    private static EVENT_PLAYER_JOINED = 'player-joined';
    private static EVENT_PLAYER_LIST = 'player-list';
    private static EVENT_HOST_ROLE_GRANTED = 'host-role-granted';
    private static EVENT_GAME_START_ERROR = 'game-start-error';

    private static EVENT_MAKE_MOVE = 'make-move';
    private static EVENT_LEAVE_ROOM = 'leave-room';
    private static EVENT_RESTART = 'restart';
    private static EVENT_GUESS = 'guess';

    public static setUpNewRoom(roomName: string, hostId: number): void {
        const newRoom = new Room(ServerSocket.getInstance(), Chat.getInstance());
        newRoom.setupRoom(roomName, hostId);
        Room.activeRooms.push(newRoom);
    }
    private static activeRooms: Room[] = [];

    private roomName: string;
    private players: PlayerVo[];
    private hostUserId: number;

    private GameService: GameService;

    constructor(private serverSocket: ServerSocket, private chat: Chat) {
        this.players = [];
    }

    private setupRoom(roomName: string, hostId: number): void {
        this.roomName = roomName;
        this.hostUserId = hostId;
        this.chat.setUpChatForRoom(roomName);
        this.serverSocket.addHandler(roomName, Room.EVENT_PLAYER_JOINED, this.handlePlayerJoin.bind(this));
        this.serverSocket.addHandler(roomName, Room.EVENT_START_GAME, this.handleGameStart.bind(this));
        this.serverSocket.addHandler(roomName, Room.EVENT_RESTART, this.handleRestart.bind(this));
    }

    private handleGameStart(receivedMessage: SocketMessage, broadcast: any, sendToUser: any): void {
        if (receivedMessage.senderId !== this.hostUserId) {
            console.error('Only the host can start the game! Start game attempt by: ' + receivedMessage.senderName);
            return;
        }   
               
        const teams = this.players;
        this.GameService = new GameService(teams);

        const data = {gamePlayers: this.GameService.getGamePlayers()};
        receivedMessage.data = data;
        broadcast(receivedMessage);        
    }


    private handlePlayerJoin(receivedMessage: SocketMessage, broadcast: any, sendToUser: any): void {
        const playerListMessage = new SocketMessage();
        Object.assign(playerListMessage, receivedMessage);
        playerListMessage.data = this.players;
        
        const userData = new UserVo();
        userData.id = receivedMessage.senderId;
        userData.nickname = receivedMessage.senderName;
        const newPlayerVo = new PlayerVo();
        newPlayerVo.userData = userData;
        this.players.push(newPlayerVo);

        receivedMessage.data = newPlayerVo;
        broadcast(receivedMessage);
        sendToUser(receivedMessage.senderId, playerListMessage, Room.EVENT_PLAYER_LIST);
        if (receivedMessage.senderId === this.hostUserId) {
            sendToUser(receivedMessage.senderId, null, Room.EVENT_HOST_ROLE_GRANTED);
        }

    }  

    private prepareGame(): void {     

        const allPlayerData = this.players.map(player => ({id: player.userData.id, name: player.userData.nickname}));

    } 

    private handleRestart(receivedMessage: SocketMessage, broadcast: any): void {

        const teams = this.players;
        this.GameService = new GameService(teams);

        const data = {gamePlayers: this.GameService.getGamePlayers()};

        receivedMessage.data = data;
        broadcast(receivedMessage);
    }

    /*private handleGuess(receivedMessage: SocketMessage, broadcast: any): void {

        const playerId = receivedMessage.data.playerId;
        receivedMessage.data = {moveResult: this.gameEngine.guess(), playerId: playerId };
        broadcast(receivedMessage);
    }*/

}