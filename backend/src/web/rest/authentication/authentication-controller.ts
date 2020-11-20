import { isNullOrUndefined } from 'util';
import { TokenService } from '../../../service/token-service';
import { UserService } from '../../../service/user-service';
import { DataResponse } from '../data-response';
import { Chat } from '../../socket/chat';

export class AuthenticationController {

    private static instance: AuthenticationController;
    public static getInstance(): AuthenticationController {
        if (isNullOrUndefined(AuthenticationController.instance)) {
            const userService = UserService.getInstance();
            const authService = TokenService.getInstance();
            const chat = Chat.getInstance();
            AuthenticationController.instance = new AuthenticationController(userService, authService, chat);
        }
        return AuthenticationController.instance;
    }


    constructor(private userService: UserService, private authService: TokenService, private chat: Chat) {
        this.userService = UserService.getInstance();
    }

    public async login(request: any, response: any): Promise<any> {
        const {email, password} = request.body;
        this.userService.getUserByEmail(email)
            .then(userVo => {
                if (userVo.email !== email || userVo.password !== password) {
                    response.send(DataResponse.withError('Hibás e-mail vagy jelszó!'));
                    return;
                }
        
                const data = {
                    token: this.authService.generateTokenForUser(userVo),
                    user: userVo
                };

                response.send(DataResponse.withData(data));
            })
            .catch(error => {
                console.error('--- login error ---\n', error);
                response.send(DataResponse.withError(error.toString()));
            })
    }

    public logout(request: any, response: any): void {
        console.log('--- logout ---');
    }

}
