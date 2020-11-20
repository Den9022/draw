import {AuthenticationController} from '../rest/authentication/authentication-controller';
import { RegistrationController } from '../rest/registration-controller';
import { AuthInterceptor } from '../rest/authentication/auth-interceptor';
import { RoomController } from '../rest/room-controller';

export class Routes {

    constructor(app: any) {
        app.post('/register', (request, response) => RegistrationController.getInstance().register(request, response));
        app.post('/login', (request, response) => AuthenticationController.getInstance().login(request, response));
        
        app.post('/logout', AuthInterceptor.checkToken, (request, response) => AuthenticationController.getInstance().logout(request, response));
        app.post('/createRoom', AuthInterceptor.checkToken, (request, response) => RoomController.getInstance().createRoom(request, response));
        app.get('/listAvailableRooms', AuthInterceptor.checkToken, (request, response) => RoomController.getInstance().listAvailableRooms(request, response));
    }

}
