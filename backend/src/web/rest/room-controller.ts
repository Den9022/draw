import { isNullOrUndefined } from "util";
import { RoomService } from "../../service/room-service";
import { RoomVo } from "../../service/vo/room-vo";
import { TokenService, TokenDecodeResult } from "../../service/token-service";
import { DataResponse } from "./data-response";
import { RoomListVo } from "../../service/vo/room-list-vo";
import { Room } from "../socket/room";

export class RoomController {

    private static instance: RoomController;
    public static getInstance(): RoomController {
        if (isNullOrUndefined(RoomController.instance)) {
            const roomService = RoomService.getInstance();
            const authService = TokenService.getInstance();
            RoomController.instance = new RoomController(roomService, authService);
        }
        return RoomController.instance;
    }

    constructor(private roomService: RoomService, private authService: TokenService) {
    }

    public createRoom(request: any, response: any): void {
        const newRoomName = request.body.name;

        this.authService.validateAndDecodeToken(request.headers['authorization'])
            .then((tokenDecodeResult: TokenDecodeResult) => {
                const loggedInUser = tokenDecodeResult.getDecodedUser();
                const roomVo = new RoomVo();
                roomVo.creatorId = loggedInUser.id;
                roomVo.available = true;
                roomVo.name = newRoomName;
                this.roomService.saveNewRoom(roomVo)
                    .then(savedRoomVo => {
                        Room.setUpNewRoom(`room-${savedRoomVo.id}`, loggedInUser.id);
                        response.send(DataResponse.withData(savedRoomVo));
                    });
            })
            .catch(error => {
                console.error('--- create room error ---\n', error);
                response.send(DataResponse.withError(error.toString()));
            });
    }

    public listAvailableRooms(request: any, response: any): void {
        this.roomService.listAvailable()
            .then((availableRooms: RoomListVo[]) => {
                response.send(DataResponse.withData(availableRooms));
            })
            .catch(error => {
                console.error('--- list available rooms error ---\n', error);
                response.send(DataResponse.withError(error.toString()));
            });
    }

}