import { IsEmail, IsNotEmpty } from "class-validator";

export class RefreshTokenDto {

    @IsNotEmpty()
    refresh_token: string;
}