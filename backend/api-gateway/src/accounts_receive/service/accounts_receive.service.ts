import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Observable } from "rxjs";
import { AccountsReceiveDto } from "../dtos/accounts_receive.dto";
import { AccountsReceiveIdDto } from "../dtos/accounts_receive_id.dto";
import { AccountsReceiveInterface } from "../interfaces/accounts_receive.interface";
import mongoose from "mongoose";

@Injectable()
export class AccountsReceiveService {
    private clientAdminBackend: ClientProxy;
    constructor(private configService: ConfigService) {
        this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${this.configService.get<String>('RABBITMQ_USER')}:${this.configService.get<String>('RABBITMQ_PASSWORD')}@${this.configService.get<String>('RABBITMQ_HOST')}:${this.configService.get<String>('RABBITMQ_PORT')}`],
                queue: 'admin-receive',
                noAck: false,
            }
        })
    }

    async getAll(id_user: string): Promise<Observable<AccountsReceiveDto[]>> {

        const accounts = this.clientAdminBackend.send<AccountsReceiveDto[], string>('consulta-accounts-receive', id_user);

        return accounts;
    }

    async getById(accountsReceiveid: AccountsReceiveIdDto): Promise<AccountsReceiveDto> {

        if (!this.validIdObject(accountsReceiveid.idAccount))
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Id do contas a receber é inválido',
            }, HttpStatus.BAD_REQUEST);

        const accounts = await this.clientAdminBackend.send<AccountsReceiveDto, AccountsReceiveIdDto>('consulta-account-receive', accountsReceiveid).toPromise();

        if (!accounts)
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                message: 'Contas a receber não encontrada',
            }, HttpStatus.NOT_FOUND);

        return accounts;
    }
    validIdObject(value: string): boolean {
        return mongoose.Types.ObjectId.isValid(value)
    }

    async postAccountsPayable(accountPay: AccountsReceiveDto) {
        this.clientAdminBackend.emit('criar-accounts-receive', accountPay);
    }

    async updateAccountsPayable(accountsReceive: AccountsReceiveDto) {
        var account = new AccountsReceiveIdDto();
        account.idAccount = accountsReceive._id;
        account.idUser = accountsReceive.id_user;

        await this.getById(account);

        this.clientAdminBackend.emit('atualizar-accounts-receive', accountsReceive);
    }

    async deleteAccountsPayable(accountsReceiveId: AccountsReceiveIdDto) {
        await this.getById(accountsReceiveId);

        this.clientAdminBackend.emit('delete-accounts-receive', accountsReceiveId);
    }

}