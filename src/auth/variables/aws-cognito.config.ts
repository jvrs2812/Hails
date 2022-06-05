import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { config } from 'process';

@Injectable()
export class AwsCognitoConfig {
    constructor(
        private configService: ConfigService
    ) { }

    public userPoolId: string = this.configService.get<string>('CONFIG_USER_POOL_ID');
    public clientId: string = this.configService.get<string>('CONFIG_CLIENT_ID');
    public region: string = this.configService.get<string>('AWS_REGION');
    public authority = `https://cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;

}