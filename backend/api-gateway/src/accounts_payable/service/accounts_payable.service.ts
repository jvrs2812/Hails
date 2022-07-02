import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { AccountsPayableDto } from "../dtos/accounts_payable.dto";
import { AccountsPayableIdDto } from "../dtos/accounts_payable_id.dto";
import mongoose from "mongoose";

@Injectable()
export class AccountsPayableService {
    private clientAdminBackend: ClientProxy;

    constructor(private configService: ConfigService) {
        this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${this.configService.get<String>('RABBITMQ_USER')}:${this.configService.get<String>('RABBITMQ_PASSWORD')}@${this.configService.get<String>('RABBITMQ_HOST')}:${this.configService.get<String>('RABBITMQ_PORT')}`],
                queue: 'admin-payable'
            }
        })
    }

    async getAll(id_user: string): Promise<Observable<AccountsPayableDto[]>> {

        const accounts = this.clientAdminBackend.send<AccountsPayableDto[], String>('consulta-accounts-payable', id_user);

        return accounts;
    }

    async getById(accountsPayable: AccountsPayableIdDto): Promise<AccountsPayableDto> {

        if (!this.validIdObject(accountsPayable.idAccount))
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Id do contas a pagar é inválido',
            }, HttpStatus.BAD_REQUEST);

        const accounts = await this.clientAdminBackend.send<AccountsPayableDto, AccountsPayableIdDto>('consulta-account-payable', accountsPayable).toPromise();

        if (!accounts)
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                message: 'Contas a pagar não encontrada',
            }, HttpStatus.NOT_FOUND);

        return accounts;
    }

    validIdObject(value: string): boolean {
        return mongoose.Types.ObjectId.isValid(value)
    }

    async postAccountsPayable(accountPay: AccountsPayableDto) {
        this.clientAdminBackend.emit('criar-accounts-payable', accountPay);
    }

    async updateAccountsPayable(accountPay: AccountsPayableDto) {
        var account = new AccountsPayableIdDto();
        account.idAccount = accountPay._id;
        account.idUser = accountPay.id_user;

        await this.getById(account);

        this.clientAdminBackend.emit('atualizar-accounts-payable', accountPay);
    }

    async deleteAccountsPayable(accountsPayanleid: AccountsPayableIdDto) {
        await this.getById(accountsPayanleid);

        this.clientAdminBackend.emit('delete-accounts-payable', accountsPayanleid);
    }
}