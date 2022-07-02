import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { AccountsReceiveDto } from '../dtos/accounts_receive.dto';
import { AccountsReceiveService } from '../service/accounts_receive.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { AccountsPayableIdDto } from '../dtos/accounts_receive_id.dto';

@Controller('api/v1/accounts-receive')
export class AccountsReceiveController {

    constructor(private accountService: AccountsReceiveService) { }

    @MessagePattern('consulta-accounts-receive')
    async getAccountsPayable(@Payload() idUser: string): Promise<AccountsReceiveDto[]> {
        return await this.accountService.getAll(idUser);
    }

    @MessagePattern('consulta-account-receive')
    async getAccountPayableById(@Payload() accountsPayableIdDto: AccountsPayableIdDto): Promise<AccountsReceiveDto> {
        return await this.accountService.getById(accountsPayableIdDto);
    }

    @MessagePattern('criar-accounts-receive')
    async PostAccountsPayable(@Payload() accountsReceive: AccountsReceiveDto) {
        return await this.accountService.postAccountsPayable(accountsReceive);
    }

    @MessagePattern('atualizar-accounts-receive')
    async PutAccountsPayable(@Payload() accountsReceive: AccountsReceiveDto) {

        return await this.accountService.updateAccountsPayable(accountsReceive);
    }

    async DeleteAccountsPayable(@Payload() accountsReceive: AccountsPayableIdDto) {

        return await this.accountService.deleteAccountsPayable(accountsReceive);
    }

}
