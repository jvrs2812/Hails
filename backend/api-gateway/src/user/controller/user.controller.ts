import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAgent } from 'amazon-cognito-identity-js';
import { Request } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from 'src/user/service/user.service';

@Controller('api/v1/accounts-receive')
export class AccountsReceiveController {

    constructor(private userService: UserService) { }

    @Get('get-email')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountsPayable(@Req() req: Request): Promise<Observable<string>> {
        return await this.userService.getEmailUser(req.user['idSystem'])
    }

}
