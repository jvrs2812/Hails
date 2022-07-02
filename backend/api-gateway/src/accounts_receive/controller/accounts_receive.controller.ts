import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAgent } from 'amazon-cognito-identity-js';
import { Request } from 'express';
import { Observable } from 'rxjs/internal/Observable';
import { AccountsReceiveDto } from '../dtos/accounts_receive.dto';
import { AccountsReceiveIdDto } from '../dtos/accounts_receive_id.dto';
import { AccountsReceiveService } from '../service/accounts_receive.service';

@Controller('api/v1/accounts-receive')
export class AccountsReceiveController {

    constructor(private accountService: AccountsReceiveService) { }

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountsPayable(@Req() req: Request): Promise<Observable<AccountsReceiveDto[]>> {
        return await this.accountService.getAll(req.user['idSystem']);
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountPayableById(@Param('id') id: string, @Req() req: Request): Promise<AccountsReceiveDto> {
        var accountsReceiveId = new AccountsReceiveIdDto();

        accountsReceiveId.idAccount = id;
        accountsReceiveId.idUser = req.user['idSystem'];

        return await this.accountService.getById(accountsReceiveId);
    }

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async PostAccountsPayable(@Req() req: Request, @Body() accountpay: AccountsReceiveDto) {

        accountpay.id_user = req.user['idSystem'];

        return await this.accountService.postAccountsPayable(accountpay);
    }

    @Put(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async PutAccountsPayable(@Param('id') id: string, @Req() req: Request, @Body() accountpay: AccountsReceiveDto) {

        accountpay.id_user = req.user['idSystem'];
        accountpay._id = id;

        return await this.accountService.updateAccountsPayable(accountpay);
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async DeleteAccountsPayable(@Param('id') id: string, @Req() req: Request) {
        var accountsReceiveId = new AccountsReceiveIdDto();

        accountsReceiveId.idAccount = id;
        accountsReceiveId.idUser = req.user['idSystem'];

        return await this.accountService.deleteAccountsPayable(accountsReceiveId);
    }

}
