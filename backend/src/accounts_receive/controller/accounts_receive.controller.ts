import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAgent } from 'amazon-cognito-identity-js';
import { Request } from 'express';
import { AccountsReceiveDto } from '../dtos/accounts_receive.dto';
import { AccountsReceiveService } from '../service/accounts_receive.service';

@Controller('api/v1/accounts-receive')
export class AccountsReceiveController {

    constructor(private accountService: AccountsReceiveService) { }

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountsPayable(@Req() req: Request): Promise<AccountsReceiveDto[]> {
        return await this.accountService.getAll(req.user['idSystem']);
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountPayableById(@Param('id') id: string, @Req() req: Request): Promise<AccountsReceiveDto> {
        return await this.accountService.getById(id, req.user['idSystem']);
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

        return await this.accountService.updateAccountsPayable(id, accountpay);
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async DeleteAccountsPayable(@Param('id') id: string, @Req() req: Request) {

        return await this.accountService.deleteAccountsPayable(id, req.user['idSystem']);
    }

}
