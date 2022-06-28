import { AuthRegisterUserInterface } from "./auth-register-user.interface";

export class AuthRegisterUserResponseInterface extends AuthRegisterUserInterface {
    token: string;
}