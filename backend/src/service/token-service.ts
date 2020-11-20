import * as jwt from 'jsonwebtoken';
import { UserVo } from './vo/user-vo';
import { isNullOrUndefined } from 'util';

export class TokenService {

    private static instance: TokenService;
    public static getInstance(): TokenService {
        if (isNullOrUndefined(TokenService.instance)) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }

    private secret = 'secret-code-should-be-in-config-file-later';
    private expirationTime = '24h';

    public generateTokenForUser(user: UserVo): string {
        const plainUserObject = JSON.parse(JSON.stringify(user));
        return jwt.sign(plainUserObject, this.secret, {expiresIn: this.expirationTime});
    }

    public validateAndDecodeToken(token: string): Promise<TokenDecodeResult> {
        if (isNullOrUndefined(token) || token.length === 0) {
            return Promise.resolve(new TokenDecodeResult(token, false, null));
        }

        let resolveMethod;
        const resultPromise = new Promise<TokenDecodeResult>(resolve => resolveMethod = resolve);
        jwt.verify(token, this.secret, (error, decodedToken) => {
            if (!isNullOrUndefined(error)) {
                resolveMethod(new TokenDecodeResult(token, false, null));
            } else {
                const decodedUserVo = UserVo.copyFrom(decodedToken as UserVo);
                const tokenDecodeResult = new TokenDecodeResult(token, true, decodedUserVo);
                resolveMethod(tokenDecodeResult);
            }
        });

        return resultPromise;
    }

}

export class TokenDecodeResult {

    constructor(private readonly token: string,
        private readonly valid: boolean,
        private readonly decodedUser: UserVo) {
    }

    public getToken(): string {
        return this.token;
    }

    public isTokenValid(): boolean {
        return this.valid;
    }

    public getDecodedUser(): UserVo {
        return this.decodedUser;
    }

}