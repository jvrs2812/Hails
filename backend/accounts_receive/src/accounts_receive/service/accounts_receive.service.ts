import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { AccountsReceiveDto } from "../dtos/accounts_receive.dto";
import { AccountsReceiveInterface } from "../interfaces/accounts_receive.interface";
import { AccountsPayableIdDto } from "../dtos/accounts_receive_id.dto";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class AccountsReceiveService {
    constructor(@InjectModel('accounts_receive') private readonly AccountsPayableModel: Model<AccountsReceiveInterface>) { }

    async getAll(id_user: string): Promise<AccountsReceiveDto[]> {

        const accounts = await this.AccountsPayableModel.find({ id_user }).exec();

        return accounts;
    }

    async getById(accountsPayableIdDto: AccountsPayableIdDto): Promise<AccountsReceiveDto> {

        const accounts = await this.AccountsPayableModel.findOne({ _id: accountsPayableIdDto.idAccount, id_user: accountsPayableIdDto.idUser }).exec();

        return accounts;
    }


    async postAccountsPayable(accountPay: AccountsReceiveDto) {
        const account = new this.AccountsPayableModel(accountPay);

        await account.save();
    }

    async updateAccountsPayable(accountsReceive: AccountsReceiveDto) {
        await this.validationDataUpdateAndDelete(accountsReceive._id, accountsReceive.id_user);

        const account = await this.AccountsPayableModel.findByIdAndUpdate({ _id: accountsReceive._id }, { $set: accountsReceive }).exec();
    }

    async deleteAccountsPayable(accountsReceive: AccountsPayableIdDto) {
        await this.validationDataUpdateAndDelete(accountsReceive.idUser, accountsReceive.idAccount);

        const account = await this.AccountsPayableModel.findOneAndDelete({ _id: accountsReceive.idAccount, id_user: accountsReceive.idUser }).exec();
    }

    async validationDataUpdateAndDelete(id_account: string, id_user: string) {
        var account = new AccountsPayableIdDto();
        account.idAccount = id_account;
        account.idUser = id_user;

        if (!await this.getById(account))
            throw new RpcException('Contas a pagar não encontrada');

    }
}