import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { AccountsReceiveDto } from "../dtos/accounts_receive.dto";
import { AccountsReceiveInterface } from "../interfaces/accounts_receive.interface";
import { AccountsPayableIdDto } from "../dtos/accounts_receive_id.dto";
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { SendEmailDto } from '../../../../usescases/email/dto/send.email.dto';
import { send } from "process";

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


    async postAccountsReceive(accountPay: AccountsReceiveDto) {
        const account = new this.AccountsReceiveModel(accountPay);

        await account.save();

        try {

            var sendEmail = new SendEmailDto();

            sendEmail.html = '';
            sendEmail.subject = 'Contas a Receber Criado';
            sendEmail.text = `Contas a receber Nº ${account._id} \n criado as  ${Date.now} pelo usuario ${accountPay.id_user}`;
            sendEmail.to = accountPay.id_user;

            this.clientAdminBackend.send<SendEmailDto, SendEmailDto>('enviar-email', sendEmail);
        } catch (err) {
            console.log('error' + err.Message);
        }

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