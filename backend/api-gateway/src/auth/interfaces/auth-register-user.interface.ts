export class AuthRegisterUserInterface extends Document {
    readonly _id: string;
    name: string;
    readonly email: string;
    readonly phoneNumber: string;
    cpf: string;
}