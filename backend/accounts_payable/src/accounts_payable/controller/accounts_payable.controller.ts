import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { Request } from 'express';
import { AccountsPayableDto } from '../dtos/accounts_payable.dto';
import { AccountsPayableIdDto } from '../dtos/accounts_payable_id.dto';
import { AccountsPayableService } from '../service/accounts_payable.service';

const ackErrors: string[] = ['E11000']

@Controller('api/v1/accounts-payable')
export class AccountsPayableController {

    constructor(private accountService: AccountsPayableService) { }

    @MessagePattern('consulta-account-payable')
    async getAccountPayableById(@Payload() accountPayableid: AccountsPayableIdDto, @Ctx() context: RmqContext): Promise<AccountsPayableDto> {
        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.getById(accountPayableid);
        } finally {
            await channel.ack(originalMessage);
        }

    }

    @EventPattern('criar-accounts-payable')
    async PostAccountsPayable(@Payload() accountpay: AccountsPayableDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        console.log(originalMessage);

        try {
            await this.accountService.postAccountsPayable(accountpay);

        } finally {
            await channel.ack(originalMessage);
        }
    }

    @MessagePattern('consulta-accounts-payable')
    async getAccountsPayable(@Payload() idUser: string, @Ctx() context: RmqContext): Promise<AccountsPayableDto[]> {

        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.getAll(idUser);
        } finally {
            await channel.ack(originalMessage);
        }

    }

    @EventPattern('delete-accounts-payable')
    async DeleteAccountsPayable(@Payload() accountPayableid: AccountsPayableIdDto, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.deleteAccountsPayable(accountPayableid);
        } finally {
            await channel.ack(originalMessage);
        }

    }

    @EventPattern('atualizar-accounts-payable')
    async PutAccountsPayable(@Payload() accountPay: AccountsPayableDto, @Ctx() context: RmqContext) {

        const channel = context.getChannelRef();

        const originalMessage = context.getMessage();

        try {
            return await this.accountService.updateAccountsPayable(accountPay);
        } finally {
            await channel.ack(originalMessage);
        }


    }
}
