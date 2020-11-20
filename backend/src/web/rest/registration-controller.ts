import { UserService } from "../../service/user-service";
import { isNullOrUndefined } from "util";
import { UserVo } from "../../service/vo/user-vo";
import { DataResponse } from "./data-response";

export class RegistrationController {

    private static instance: RegistrationController;
    public static getInstance(): RegistrationController {
        if (isNullOrUndefined(RegistrationController.instance)) {
            const userService = UserService.getInstance();
            RegistrationController.instance = new RegistrationController(userService);
        }
        return RegistrationController.instance;
    }

    constructor(private userService: UserService) {
    }

    public register(request: any, response: any): void {
        const userData = request.body as UserVo;
        this.userService.saveNewUser(userData)
            .then(savedUser => {
                response.send(DataResponse.withData(savedUser));
            }).catch(error => {
                response.send(DataResponse.withError(error));
            });
    }


}