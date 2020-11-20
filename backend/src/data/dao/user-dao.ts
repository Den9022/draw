import { DatabaseConnection } from "../database/database-connection";
import { isNullOrUndefined } from "util";
import { UserEntity } from "../entity/user-entity";

export class UserDao {

    private static instance: UserDao;

    public static getInstance(): UserDao {
        if (isNullOrUndefined(UserDao.instance)) {
            const dbConnection = DatabaseConnection.getInstance();
            UserDao.instance = new UserDao(dbConnection);
        }
        return UserDao.instance;
    }

    constructor(private dbConnection: DatabaseConnection) {
    }

    public async findUserById(id: number): Promise<UserEntity> {
        const sql = `
            SELECT * FROM thesis.USER
            WHERE id = ?;
        `;
        const returnedUsers = await this.dbConnection.runSql(sql, [id]);
        return returnedUsers.length > 0 ? returnedUsers[0] : {};
    }

    public async findAllById(ids: number[]): Promise<UserEntity[]> {
        if (ids.length === 0) {
            return Promise.resolve([]);
        }
        const sql = `
            SELECT * FROM thesis.USER
            WHERE id in (${ids.join(',')});
        `;
        return await this.dbConnection.runSql(sql);
    }

    public async findUserByEmail(email: string): Promise<UserEntity> {
        const sql = `
            SELECT * FROM thesis.USER
            WHERE email = ?;
        `;
        const returnedUsers = await this.dbConnection.runSql(sql, [email]);
        return returnedUsers.length > 0 ? returnedUsers[0] : {};
    }

    public async saveNewUser(userEntity: UserEntity): Promise<any> {
        const insertSql = `
            INSERT INTO thesis.USER
            (email, password, nickname)
            VALUES (?, ?, ?);
        `;
        const values = [userEntity.email, userEntity.password, userEntity.nickname];
        return await this.dbConnection.runSql(insertSql, values)
    }

}