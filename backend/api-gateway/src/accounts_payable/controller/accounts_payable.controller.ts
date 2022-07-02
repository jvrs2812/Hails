import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAgent } from 'amazon-cognito-identity-js';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AccountsPayableDto } from '../dtos/accounts_payable.dto';
import { AccountsPayableIdDto } from '../dtos/accounts_payable_id.dto';
import { AccountsPayableService } from '../service/accounts_payable.service';
@Controller('api/v1/accounts-payable')
export class AccountsPayableController {

    constructor(private accountService: AccountsPayableService) { }

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountsPayable(@Req() req: Request): Promise<Observable<AccountsPayableDto[]>> {
        return await this.accountService.getAll(req.user['idSystem']);
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async getAccountPayableById(@Param('id') id: string, @Req() req: Request): Promise<AccountsPayableDto> {
        var accountsPayable = new AccountsPayableIdDto();

        accountsPayable.idAccount = id;
        accountsPayable.idUser = req.user['idSystem'];

        return this.accountService.getById(accountsPayable);
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
        accountpay._id = id;

        return await this.accountService.updateAccountsPayable(accountpay);
    }

    @Delete(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard('jwt'))
    @UsePipes(ValidationPipe)
    async DeleteAccountsPayable(@Param('id') id: string, @Req() req: Request) {
        var accountsPayanleid = new AccountsPayableIdDto();

        accountsPayanleid.idAccount = id;
        accountsPayanleid.idUser = req.user['idSystem'];

        return await this.accountService.deleteAccountsPayable(accountsPayanleid);
    }

}
