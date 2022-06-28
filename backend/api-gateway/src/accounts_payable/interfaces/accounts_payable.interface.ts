import { PayamentsInterface } from "src/payaments/interfaces/payaments.interface";

export class AccountsPayableInterface extends Document {
    readonly _id: string;
    id_user: string;
    favored: string;
    description: string;
    number_installments: number;
    value_total: number;
    value_total_payament: number;
    installments: PayamentsInterface[];
}