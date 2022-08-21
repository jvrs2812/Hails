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
    async getAccountsPayable(@Payload() idUser: string, @Ctx() context: RmqContext): Promise<AccountsReceiveDto[]> {

        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.getAll(idUser);
        } finally {
            await channel.ack(originalMessage);
        }


    }

    @MessagePattern('consulta-account-receive')
    async getAccountPayableById(@Payload() accountsPayableIdDto: AccountsPayableIdDto, @Ctx() context: RmqContext): Promise<AccountsReceiveDto> {

        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.getById(accountsPayableIdDto);
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('criar-accounts-receive')
    async PostAccountsPayable(@Payload() accountsReceive: AccountsReceiveDto, @Ctx() context: RmqContext) {

        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.postAccountsReceive(accountsReceive);
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('atualizar-accounts-receive')
    async PutAccountsPayable(@Payload() accountsReceive: AccountsReceiveDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.updateAccountsReceive(accountsReceive);
        } finally {
            await channel.ack(originalMessage);
        }
    }

    @EventPattern('delete-accounts-receive')
    async DeleteAccountsPayable(@Payload() accountsReceive: AccountsPayableIdDto, @Ctx() context: RmqContext) {



        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.deleteAccountsReceive(accountsReceive);
        } finally {
            await channel.ack(originalMessage);
        }
    }

}
