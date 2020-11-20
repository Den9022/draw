import { isNullOrUndefined } from 'util';
import { TokenService, TokenDecodeResult } from '../../../service/token-service';
import { DataResponse } from '../data-response';

export class AuthInterceptor {

  private static authService = TokenService.getInstance();

  public static checkToken(request: any, response: any, next: any) {
    const token = request.headers['authorization'];
    if (isNullOrUndefined(token)) {
      return response.json(DataResponse.withError('Hiányzó felhasználói azonosító jel (token)'));
    }

    AuthInterceptor.authService.validateAndDecodeToken(token)
      .then((decodedTokenResult: TokenDecodeResult) => {
        if (decodedTokenResult.isTokenValid()) {
          next();
        } else {
          return response.json(DataResponse.withError('Érvénytelen felhasználói azonosító jel (token)'));
        }
      })

  };

}