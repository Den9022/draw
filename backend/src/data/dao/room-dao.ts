import { isNullOrUndefined } from "util";
import { DatabaseConnection } from "../database/database-connection";
import { RoomEntity } from "../entity/room-entity";

export class RoomDao {

    private static instance: RoomDao;
    public static getInstance(): RoomDao {
        if (isNullOrUndefined(RoomDao.instance)) {
            const dbConnection = DatabaseConnection.getInstance();
            RoomDao.instance = new RoomDao(dbConnection);
        }
        return RoomDao.instance;
    }

    constructor(private dbConnection: DatabaseConnection) {
    }

    public async saveNewRoom(roomEntity: RoomEntity): Promise<any> {
        const insertSql = `
            INSERT INTO thesis.ROOM
            (name, creatorId, available)
            VALUES (?, ?, ?);
        `;
        const values = [roomEntity.name, roomEntity.creatorId, roomEntity.available];
        return await this.dbConnection.runSql(insertSql, values);
    }

    public async findRoomById(id: number): Promise<RoomEntity> {
        const sql = `
            SELECT * FROM thesis.ROOM
            WHERE id ?;
        `;
        const returnedRooms = await this.dbConnection.runSql(sql, [id]);
        return returnedRooms.length > 0 ? returnedRooms[0] : {};
    }

    public async findAllAvailable(): Promise<RoomEntity[]> {
        const sql = `
            SELECT * FROM thesis.ROOM
            WHERE available = true;
        `;
        return await this.dbConnection.runSql(sql);
    }

    public async findByNameAndCreatorId(roomName: string, creatorId: number): Promise<any> {
        const sql = `
            SELECT * FROM thesis.ROOM
            WHERE name = ? AND creatorId = ?;
        `;
        const returnedRooms = await this.dbConnection.runSql(sql, [roomName, creatorId]);
        return returnedRooms.length > 0 ? returnedRooms[0] : {};
    }

    public async deleteRoom(id: number): Promise<any> {
        const sql = `
            DELETE FROM thesis.ROOM
            WHERE id = ?;
        `;
        return await this.dbConnection.runSql(sql, [id]);
    }

    public async makeUnavailable(id: number): Promise<any> {
        const sql = `
            UPDATE thesis.ROOM
            SET available = false
            WHERE id = ?;
        `;
        return await this.dbConnection.runSql(sql, [id]);
    }

}