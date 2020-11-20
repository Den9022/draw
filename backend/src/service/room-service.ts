import { isNullOrUndefined } from "util";
import { RoomDao } from "../data/dao/room-dao";
import { RoomListVo } from "./vo/room-list-vo";
import { UserDao } from "../data/dao/user-dao";
import { RoomVo } from "./vo/room-vo";
import { EntityVoConverter } from "./vo/entity-vo-converter";
import { RoomEntity } from "src/data/entity/room-entity";

export class RoomService {

    private static instance: RoomService;
    public static getInstance(): RoomService {
        if (isNullOrUndefined(RoomService.instance)) {
            const roomDao = RoomDao.getInstance();
            const userDao = UserDao.getInstance();
            RoomService.instance = new RoomService(roomDao, userDao);
        }
        return RoomService.instance;
    }

    constructor(private roomDao: RoomDao, private userDao: UserDao) {
    }

    public async listAvailable(): Promise<RoomListVo[]> {
        const availableRooms = await this.roomDao.findAllAvailable();
        const creatorUsers = await this.userDao.findAllById(availableRooms.map(roomEntity => roomEntity.creatorId));

        return availableRooms.map(room => {
            const creator = creatorUsers.find(userEntity => userEntity.id === room.creatorId);
            const roomListVo = new RoomListVo();
            roomListVo.id = room.id;
            roomListVo.name = room.name;
            roomListVo.creatorUserName = creator.nickname;
            return roomListVo;
        });
    }

    public async makeUnavailable(id: number): Promise<any> {
        return await this.roomDao.makeUnavailable(id);
    }

    public async deleteRoom(id: number): Promise<any> {
        return await this.roomDao.deleteRoom(id);
    }

    public async saveNewRoom(roomVo: RoomVo): Promise<RoomVo> {
        const roomEntity = EntityVoConverter.toEntity(roomVo) as RoomEntity;
        await this.roomDao.saveNewRoom(roomEntity);
        const savedRoomEntity = await this.roomDao.findByNameAndCreatorId(roomEntity.name, roomEntity.creatorId);
        return EntityVoConverter.toVo(savedRoomEntity) as RoomVo;
    }

}