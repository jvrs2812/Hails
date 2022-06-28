import { IsEmail, IsMobilePhone, IsString, Matches } from "class-validator";

export class AuthRegisterUserDto {
    id: string;

    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Senha inválida' })
    password: string;

    @IsMobilePhone('pt-BR')
    phoneNumber: string;

    @Matches(/([0 - 9]{ 2}[\.]?[0 - 9]{ 3}[\.]?[0 - 9]{ 3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/, { message: 'CPF inválido' })
    cpf: string;
}