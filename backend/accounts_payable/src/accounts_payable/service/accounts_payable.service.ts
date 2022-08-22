import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { Model, now } from "mongoose";
import { Observable } from "rxjs";
import { AccountsPayableDto } from "../dtos/accounts_payable.dto";
import { AccountsPayableIdDto } from "../dtos/accounts_payable_id.dto";
import { AccountsPayableInterface } from "../interfaces/accounts_payable.interface";
import { ConfigService } from "@nestjs/config";
import { SendEmailDto } from "src/email/dto/send.email.dto";
import { throws } from "assert";

@Injectable()
export class AccountsPayableService {
    private clientAdminBackend: ClientProxy;
    constructor(@InjectModel('accounts_payable') private readonly AccountsPayableModel: Model<AccountsPayableInterface>, private configService: ConfigService) {
        this.clientAdminBackend = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [`amqp://${this.configService.get<String>('RABBITMQ_USER')}:${this.configService.get<String>('RABBITMQ_PASSWORD')}@${this.configService.get<String>('RABBITMQ_HOST')}:${this.configService.get<String>('RABBITMQ_PORT')}`],
                queue: 'admin-email'
            }
        })
    }

    async getAll(id_user: string): Promise<AccountsPayableDto[]> {

        const accounts = await this.AccountsPayableModel.find({ id_user }).exec();

        return accounts;
    }

    async getById(accountPayableid: AccountsPayableIdDto): Promise<AccountsPayableDto> {

        const accounts = await this.AccountsPayableModel.findOne({ _id: accountPayableid.idAccount, id_user: accountPayableid.idUser }).exec();

        return accounts;
    }


    async postAccountsPayable(accountPay: AccountsPayableDto) {
        const account = new this.AccountsPayableModel(accountPay);

        await account.save();

        var emailDto = new SendEmailDto();

        var utc_timestamp = new Date().toLocaleDateString('pt-BR');
        var hora = new Date().getHours();
        var minuto = new Date().getMinutes();
        var seconds = new Date().getSeconds();

        emailDto.subject = 'Contas a Pagar Criado 📨';
        emailDto.to = account.id_user;
        emailDto.text = `Contas a pagar Nº: ${account._id} \ndata: ${utc_timestamp} ás ${hora}:${minuto}:${seconds} \nFavorecido: ${account.favored} \nValor: ${account.value_total} \nNº de Parcelas: ${account.number_installments} `;

        this.clientAdminBackend.emit<any, SendEmailDto>('enviar-email', emailDto);
    }

    async updateAccountsPayable(accountPay: AccountsPayableDto) {
        await this.validationDataUpdateAndDelete(accountPay._id, accountPay.id_user);

        const account = await this.AccountsPayableModel.findByIdAndUpdate({ _id: accountPay._id }, { $set: accountPay }).exec();
    }

    async deleteAccountsPayable(accountPayableid: AccountsPayableIdDto) {
        await this.validationDataUpdateAndDelete(accountPayableid.idAccount, accountPayableid.idUser);

        const account = await this.AccountsPayableModel.findOneAndDelete({ _id: accountPayableid.idAccount, id_user: accountPayableid.idUser }).exec();
    }

    async validationDataUpdateAndDelete(id_account: string, id_user: string) {
        const accountsPayanleid = new AccountsPayableIdDto();

        accountsPayanleid.idAccount = id_account;
        accountsPayanleid.idUser = id_user;

        if (!await this.getById(accountsPayanleid))
            throw new RpcException('Contas a pagar não encontrada');
    }
}