import { UserVo } from "./vo/user-vo";
import { EntityVoConverter } from "./vo/entity-vo-converter";
import { UserDao } from "../data/dao/user-dao";

export class UserService {

    private static instance: UserService;
    public static getInstance(): UserService {
        if (!UserService.instance) {
            const userDao = UserDao.getInstance();
            UserService.instance = new UserService(userDao);
        }
        return UserService.instance;
    }

    constructor(private userDao: UserDao) {
    }

    public async getUserById(id: number): Promise<UserVo> {
        const loadedUserEntity = await this.userDao.findUserById(id);
        return EntityVoConverter.toVo(loadedUserEntity);
    }

    public async getUserByEmail(email: string): Promise<UserVo> {
        const userEntity = await this.userDao.findUserByEmail(email);
        return EntityVoConverter.toVo(userEntity);
    }

    public async saveNewUser(userVo: UserVo): Promise<UserVo> {
        const userEntity = EntityVoConverter.toEntity(userVo);
        return this.userDao.saveNewUser(userEntity)
            .then(async () => {
                const savedUserEntity =  await this.userDao.findUserByEmail(userEntity.email);
                return EntityVoConverter.toVo(savedUserEntity);
            });
    }

}
