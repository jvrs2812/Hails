import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { AccountsReceiveDto } from "../dtos/accounts_receive.dto";
import { AccountsReceiveInterface } from "../interfaces/accounts_receive.interface";
import { AccountsPayableIdDto } from "../dtos/accounts_receive_id.dto";
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { send } from "process";
import { SendEmailDto } from "../email/dto/send.email.dto";

@Injectable()
export class AccountsReceiveService {
    private clientAdminBackend: ClientProxy;
    private readonly logger = new Logger(AccountsReceiveService.name);
    constructor(@InjectModel('accounts_receive') private readonly AccountsReceiveModel: Model<AccountsReceiveInterface>, private configService: ConfigService) {
        this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${this.configService.get<String>('RABBITMQ_USER')}:${this.configService.get<String>('RABBITMQ_PASSWORD')}@${this.configService.get<String>('RABBITMQ_HOST')}:${this.configService.get<String>('RABBITMQ_PORT')}`],
                queue: 'admin-email'
            }
        })
    }

    async getAll(id_user: string): Promise<AccountsReceiveDto[]> {

        const accounts = await this.AccountsReceiveModel.find({ id_user }).exec();

        return accounts;
    }

    async getById(accountsPayableIdDto: AccountsPayableIdDto): Promise<AccountsReceiveDto> {

        const accounts = await this.AccountsReceiveModel.findOne({ _id: accountsPayableIdDto.idAccount, id_user: accountsPayableIdDto.idUser }).exec();

        return accounts;
    }

    returnTime(): string {
        var hora = new Date().getHours().toString();
        var minuto = new Date().getMinutes().toString();
        var seconds = new Date().getSeconds().toString();

        if (hora.length == 1) {
            hora = "0" + hora;
        }

        if (minuto.length == 1) {
            minuto = "0" + minuto;
        }

        if (seconds.length == 1) {
            seconds = "0" + seconds;
        }

        return `${hora}:${minuto}:${seconds}`;
    }


    async postAccountsReceive(accountPay: AccountsReceiveDto) {
        const account = new this.AccountsReceiveModel(accountPay);

        await account.save();

        var emailDto = new SendEmailDto();

        var utc_timestamp = new Date().toLocaleDateString('pt-BR');

        emailDto.subject = 'Contas a Receber Criado 📨';
        emailDto.to = account.id_user;
        emailDto.text = `Contas a Receber Nº: ${account._id} \ndata: ${utc_timestamp} as ${this.returnTime()} \nFavorecido: ${account.favored} \nValor: ${account.value_total} \nNº de Parcelas: ${account.number_installments} `;

        this.clientAdminBackend.emit<any, SendEmailDto>('enviar-email', emailDto);
    }

    async updateAccountsReceive(accountsReceive: AccountsReceiveDto) {
        await this.validationDataUpdateAndDelete(accountsReceive._id, accountsReceive.id_user);

        const account = await this.AccountsReceiveModel.findByIdAndUpdate({ _id: accountsReceive._id }, { $set: accountsReceive }).exec();
    }

    async deleteAccountsReceive(accountsReceive: AccountsPayableIdDto) {
        await this.validationDataUpdateAndDelete(accountsReceive.idUser, accountsReceive.idAccount);

        const account = await this.AccountsReceiveModel.findOneAndDelete({ _id: accountsReceive.idAccount, id_user: accountsReceive.idUser }).exec();
    }

    async validationDataUpdateAndDelete(id_account: string, id_user: string) {
        var account = new AccountsPayableIdDto();
        account.idAccount = id_account;
        account.idUser = id_user;

        if (!await this.getById(account))
            throw new RpcException('Contas a pagar não encontrada');

    }
}