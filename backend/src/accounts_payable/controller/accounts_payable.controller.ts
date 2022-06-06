import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAgent } from 'amazon-cognito-identity-js';
import { Request } from 'express';
import { AccountsPayableDto } from '../dtos/accounts_payable.dto';
import { AccountsPayableService } from '../service/accounts_payable.service';

@Controller('api/v1/accounts-payable')
export class AccountsPayableController {

    constructor(private accountService: AccountsPayableService) { }

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountsPayable(@Req() req: Request): Promise<AccountsPayableDto[]> {
        return await this.accountService.getAll(req.user['idSystem']);
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountPayableById(@Param('id') id: string, @Req() req: Request): Promise<AccountsPayableDto> {
        return await this.accountService.getById(id, req.user['idSystem']);
    }

    @Post()
    @HttpCode(201)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async PostAccountsPayable(@Req() req: Request, @Body() accountpay: AccountsPayableDto) {

        accountpay.id_user = req.user['idSystem'];

        return await this.accountService.postAccountsPayable(accountpay);
    }

    @Put(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async PutAccountsPayable(@Param('id') id: string, @Req() req: Request, @Body() accountpay: AccountsPayableDto) {

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
