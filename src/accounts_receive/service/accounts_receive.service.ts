import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountsReceiveDto } from "../dtos/accounts_receive.dto";
import { AccountsReceiveInterface } from "../interfaces/accounts_receive.interface";

@Injectable()
export class AccountsReceiveService {
    constructor(@InjectModel('accounts_receive') private readonly AccountsPayableModel: Model<AccountsReceiveInterface>) { }

    async getAll(id_user: string): Promise<AccountsReceiveDto[]> {

        const accounts = await this.AccountsPayableModel.find({ id_user }).exec();

        return accounts;
    }

    async getById(id: string, id_user: string): Promise<AccountsReceiveDto> {

        const accounts = await this.AccountsPayableModel.findOne({ _id: id, id_user: id_user }).exec();

        return accounts;
    }


    async postAccountsPayable(accountPay: AccountsReceiveDto) {
        const account = new this.AccountsPayableModel(accountPay);

        await account.save();
    }

    async updateAccountsPayable(idAccount: string, accountPay: AccountsReceiveDto) {
        await this.validationDataUpdateAndDelete(idAccount, accountPay.id_user);

        const account = await this.AccountsPayableModel.findByIdAndUpdate({ _id: idAccount }, { $set: accountPay }).exec();
    }

    async deleteAccountsPayable(id: string, id_user: string) {
        await this.validationDataUpdateAndDelete(id, id_user);

        const account = await this.AccountsPayableModel.findOneAndDelete({ _id: id, id_user: id_user }).exec();
    }

    async validationDataUpdateAndDelete(id_account: string, id_user: string) {
        if (!await this.getById(id_account, id_user))
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Contas a pagar não encontrada',
            }, HttpStatus.NOT_FOUND);

    }
}