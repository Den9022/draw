import { BaseVo } from "./base-vo";

export class UserVo extends BaseVo {

    public static copyFrom(sourceVo: UserVo): UserVo {
        const copyVo = new UserVo();
        copyVo.id = sourceVo.id;
        copyVo.nickname = sourceVo.nickname;
        copyVo.email = sourceVo.email;
        copyVo.password = sourceVo.password;
        return copyVo;
    }

    public nickname: string;
    public email: string;
    public password: string;

}