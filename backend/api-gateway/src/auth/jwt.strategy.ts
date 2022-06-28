import { Inject, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { passportJwtSecret } from "jwks-rsa";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AwsCognitoConfig } from "./variables/aws-cognito.config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    private logger = new Logger(JwtStrategy.name);

    constructor(
        private authConfig: AwsCognitoConfig
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            audience: authConfig.clientId,
            issue: authConfig.authority,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${authConfig.authority}/.well-known/jwks.json`
            })
        })
    }

    public async validate(payload: any) {

        return {
            idUser: payload.sub,
            email: payload.email,
            idSystem: payload['custom:idSystem']
        }
    }
}